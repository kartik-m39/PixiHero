import { Application, extend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { useCallback, useEffect,useState, useRef } from "react";
import { calculateCanvasSize } from "../../helpers/common";
import { Level } from "../Levels/Level";
import { Hero } from "../Hero/Hero";
import { TILE_SIZE } from "../../constants/game-world";
import { Camera } from "../Camera/Camera";
import { WebRTCService, type MovementData } from "../../services/WebRTCService";
import { ChatBox, type ChatMessage } from "../ChatBox/ChatBox";
import { PeerHero } from "../PeerHero/PeerHero";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

interface ExperienceProps {
  roomId: string;
}

export const Experience = ({ roomId }: ExperienceProps) => {
    const [heroPosition, setHeroPosition] = useState({x:0, y:0});
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);
    const [background, setBackground] = useState(undefined);
    const [HeroTexture, setHeroTexture] = useState(undefined);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [peerMovements, setPeerMovements] = useState<Map<string, MovementData>>(new Map());
    const webrtcService = useRef<WebRTCService | null>(null);
    const lastMovementRef = useRef<{x: number, y: number} | null>(null);


    // using callback as we do not want recreation of the function during each re-render
    const updateHeroposition = useCallback((x: number, y: number) => {

      // using floor as we want to snap our hero within the grid based system
      const newPos = {
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE)
      };
      
      setHeroPosition(newPos);
      
      // Send movement to peers via WebRTC
      if (webrtcService.current && 
          (!lastMovementRef.current || 
           lastMovementRef.current.x !== x || 
           lastMovementRef.current.y !== y)) {
        webrtcService.current.sendMovement({
          x,
          y,
          direction: null,
          isMoving: true
        });
        lastMovementRef.current = {x, y};
      }
    } ,[])



    // Loading all  textures asynchronously, for optimising and increasing performance we used empty dependency array
    useEffect(() => {
        Assets.load("/img.jpeg").then((texture) => {
            setBackground(texture);
        });
        Assets.load("/hero.png").then((texture) => {
            setHeroTexture(texture);
        });
    }, []);

    // Initialize WebRTC connection
    useEffect(() => {
        const handlePeerMovement = (peerId: string, data: MovementData) => {
            setPeerMovements(prev => new Map(prev).set(peerId, data));
        };

        const handleChatMessage = (from: string, message: string, timestamp: number) => {
            setChatMessages(prev => [...prev, { from, message, timestamp }]);
        };

        webrtcService.current = new WebRTCService(
            roomId,
            handlePeerMovement,
            handleChatMessage
        );
        webrtcService.current.connect();

        return () => {
            webrtcService.current?.disconnect();
        };
    }, [roomId]);





    // Putting in callback would prevent re-creation of that function between different renders
    const updateCanvas = useCallback(() => {
        // The re-render will actually happen when we resize
        setCanvasSize(calculateCanvasSize);
    }, [])





    // using useffects to add event listeners
    useEffect(() => {
        // whenever the canvas size changes only then re-render
        window.addEventListener("resize", updateCanvas);

        // Cleaning up the component and event listener
        return () => window.removeEventListener("resize", updateCanvas);
    }, [updateCanvas])





  const handleSendMessage = useCallback((message: string) => {
    if (webrtcService.current) {
      webrtcService.current.sendChatMessage(message);
      // Add own message to chat
      setChatMessages(prev => [...prev, {
        from: webrtcService.current!.getClientId(),
        message,
        timestamp: Date.now()
      }]);
    }
  }, []);

  return (
    <>
      {/* We'll wrap our components with an <Application> component to provide the Pixi.js Application context */}
      <Application width={canvasSize.width} height={canvasSize.height}>
          <pixiContainer>

              {/* Pssing the height and width explicitly so that if the main container size changes the sprite size should also change accordingly */}
              <pixiSprite texture={background} width={canvasSize.width} height={canvasSize.height}/>

              <Camera canvasSize={canvasSize} heroPosition={heroPosition}>
                <Level/>
                <Hero texture={HeroTexture} onMove={updateHeroposition}/>
                
                {/* Render peer heroes */}
                {Array.from(peerMovements.entries()).map(([peerId, movementData]) => (
                  <PeerHero 
                    key={peerId}
                    peerId={peerId}
                    texture={HeroTexture}
                    movementData={movementData}
                  />
                ))}
              </Camera>

   
          </pixiContainer>
      </Application>

      {/* Chat UI */}
      {webrtcService.current && (
        <ChatBox 
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          currentUserId={webrtcService.current.getClientId()}
        />
      )}
    </>
  );
};
