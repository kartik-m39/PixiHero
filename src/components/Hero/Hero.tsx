import { type Texture } from "pixi.js"
import { useCallback, useEffect, useRef } from "react"
import { ANIMATION_SPEED, DEFAULT_POS_X, DEFAULT_POS_Y, MOVE_SPEED } from "../../constants/game-world"
import { useHeroControls } from "./useHeroControls"
import { useTick } from "@pixi/react"
import { type Direction, type Position } from "../../types/common"
import { calculateNewTarget, checkCanMove, handleMovement } from "../../helpers/common"
import { useHeroAnimation } from "./useHeroAnimation"

interface HeroProps {
    texture: Texture | undefined
    onMove: (gridX: number, gridY: number) => void
}

export const Hero = ({texture, onMove} : HeroProps) => {
    const position = useRef({x: DEFAULT_POS_X, y: DEFAULT_POS_Y});          // keeping the track of the hero position
    const targetPosition = useRef<Position | null>(null);
    const currentDirection = useRef<Direction | null>(null);
    const {getControlsDirection} = useHeroControls();
    const direction = getControlsDirection();

    const isMoving = useRef<boolean>(false);

    // Only initialize the animation hook when texture is available and is not null or undefined
    const { sprite, updateSprite} = useHeroAnimation({
        texture: texture!, // Use non-null assertion since we check below
        frameHeight: 64,
        frameWidth: 64,
        totalFrames: 9,
        animationSpeed: ANIMATION_SPEED
    })

    // Informing parent component about the re-render of the hero component ie the hero is moving
    useEffect(() => {
        onMove(position.current.x, position.current.y);  
    }, [onMove])

    const setNextTarget = useCallback((direction: Direction) => {
        if(targetPosition.current) return
        const { x,y } = position.current
        currentDirection.current = direction
        const newTarget = calculateNewTarget(x,y,direction)

        if(checkCanMove(newTarget)){
            targetPosition.current = newTarget
        }
    },[])

    // Delta is basically the diff bw the time frames of the frames
    useTick((ticker) => {
        // as hook passes ticker object so we are extracting delta from it
        const delta = ticker.deltaTime

        if(direction){
            //set next target
            setNextTarget(direction);
        }

        //handle movement
        // only moving when we have target
        if(targetPosition.current){
            const {completed, position: newPosition} = handleMovement(position.current, targetPosition.current, MOVE_SPEED, delta);

            position.current = newPosition;
            isMoving.current = true;

            if(completed){
                const {x,y} = position.current;
                onMove(x,y);
                targetPosition.current = null;
                isMoving.current = false
            }
        }

        //handle completion of the movement
        updateSprite(currentDirection.current, isMoving.current)
    })

    return(
        <pixiContainer>

            {/* Need to set up the correct anchor value, anchor is basically the offset*/}
            {sprite &&  <pixiSprite texture={sprite?.texture} x={position.current.x} y={position.current.y} scale={0.5} anchor={0.8}/>}

        </pixiContainer>
    )
}