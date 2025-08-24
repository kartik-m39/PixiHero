import { COLLISION_MAP } from "../constants/collision-map";
import { COLS, TILE_SIZE } from "../constants/game-world";
import type { Direction, Position } from "../types/common";

export function calculateCanvasSize() {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export const calculateNewTarget = (x:number, y:number, direction: Direction) => {
  return {
      x: (x/TILE_SIZE) * TILE_SIZE + (direction === "LEFT" ? -TILE_SIZE : direction === "RIGHT" ? TILE_SIZE : 0),
      y: (y/TILE_SIZE) * TILE_SIZE + (direction === "UP" ? -TILE_SIZE : direction === "DOWN" ? TILE_SIZE : 0)

  }
}



// To check whether the hero can move further or not depending on the collision map
export const checkCanMove = (target: Position) => {
  const row = Math.floor(target.y/TILE_SIZE);
  const col = Math.floor(target.x/TILE_SIZE);
  const index = COLS * row + col;

  if(index < 0 || index >= COLLISION_MAP.length){
    return false;
  }

  return COLLISION_MAP[index] !== 1
}

const moveTowards = (current: number, target: number, maxStep: number) => {
  return (current + Math.sign(target - current) * Math.min(Math.abs(target - current), maxStep))
}

const continueMovement = (currentPostion: Position, targetPosition: Position, step: number): Position => {
  return {
      x: moveTowards(currentPostion.x, targetPosition.x, step),
      y: moveTowards(currentPostion.y, targetPosition.y, step)
  }
}

export const handleMovement = (currentPostion: Position, targetPosition: Position, moveSpeed: number, delta: number) => {
  const step = moveSpeed * TILE_SIZE * delta;
  const distance = Math.hypot(targetPosition.x - currentPostion.x, targetPosition.y - currentPostion.y);

  if(distance <= step){
    return {
      position: targetPosition,
      completed: true
    }
  }

  // Position when movement is continued
  return {
    position: continueMovement(currentPostion, targetPosition, step),
    completed: false
  }
}