import { Application, extend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { useCallback, useEffect,useState, useRef } from "react";
import { calculateCanvasSize } from "../../helpers/common";
import { Level } from "../Levels/Level";
import { Hero } from "../Hero/Hero";
import { TILE_SIZE } from "../../constants/game-world";
import { Camera } from "../Camera/Camera";
import { WebSocketService, type MovementData } from "../../services/WebSocketService";
import { ChatBox, type ChatMessage } from "../ChatBox/ChatBoxInline";
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
    const wsService = useRef<WebSocketService | null>(null);


    // using callback as we do not want recreation of the function during each re-render
    const updateHeroposition = useCallback((x: number, y: number, direction: string | null, isMoving: boolean) => {

      // using floor as we want to snap our hero within the grid based system
      const newPos = {
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE)
      };
      
      setHeroPosition(newPos);
      
      // Send movement to peers via WebSocket every frame
      if (wsService.current) {
        wsService.current.sendMovement({
          x,
          y,
          direction,
          isMoving
        });
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

    // Initialize WebSocket connection
    useEffect(() => {
        const handlePeerMovement = (peerId: string, data: MovementData) => {
            console.log('Experience: Received peer movement', peerId, data);
            setPeerMovements(prev => {
                const newMap = new Map(prev);
                newMap.set(peerId, data);
                console.log('Experience: Updated peerMovements, size:', newMap.size);
                return newMap;
            });
        };

        const handleChatMessage = (from: string, message: string, timestamp: number) => {
            setChatMessages(prev => [...prev, { from, message, timestamp }]);
        };

        const handlePeerJoined = (peerId: string) => {
            console.log('Peer joined:', peerId);
        };

        const handlePeerLeft = (peerId: string) => {
            console.log('Peer left:', peerId);
            setPeerMovements(prev => {
                const newMap = new Map(prev);
                newMap.delete(peerId);
                return newMap;
            });
        };

        wsService.current = new WebSocketService(
            roomId,
            handlePeerMovement,
            handleChatMessage,
            handlePeerJoined,
            handlePeerLeft
        );
        wsService.current.connect();

        return () => {
            wsService.current?.disconnect();
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
    if (wsService.current) {
      wsService.current.sendChatMessage(message);
      // Add own message to chat
      setChatMessages(prev => [...prev, {
        from: wsService.current!.getClientId(),
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
                {Array.from(peerMovements.entries()).map(([peerId, movementData]) => {
                  console.log('Rendering peer:', peerId, 'at', movementData.x, movementData.y);
                  return (
                    <PeerHero 
                      key={peerId}
                      peerId={peerId}
                      texture={HeroTexture}
                      movementData={movementData}
                    />
                  );
                })}
              </Camera>

   
          </pixiContainer>
      </Application>

      {/* Chat UI */}
      {wsService.current && (
        <ChatBox 
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          currentUserId={wsService.current.getClientId()}
        />
      )}
    </>
  );
};
