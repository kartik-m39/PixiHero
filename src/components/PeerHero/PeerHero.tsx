import { type Texture } from "pixi.js"
import { useRef } from "react"
import { type MovementData } from "../../services/WebRTCService"

interface PeerHeroProps {
    texture: Texture | undefined
    peerId: string
    movementData: MovementData
}

export const PeerHero = ({ texture, movementData }: PeerHeroProps) => {
    const position = useRef({ x: movementData.x, y: movementData.y });

    position.current = { x: movementData.x, y: movementData.y };

    return (
        <pixiContainer>
            {texture && (
                <pixiSprite 
                    texture={texture} 
                    x={position.current.x} 
                    y={position.current.y} 
                    scale={0.5} 
                    anchor={0.8}
                    tint={0xff6b6b}
                />
            )}
        </pixiContainer>
    )
}
