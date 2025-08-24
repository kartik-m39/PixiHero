export interface Position {
    x: number,
    y: number
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT" | undefined

// Mapping the direction with the keys
export const DIRECTION_KEYS: Record<string,Direction> = {
    KeyW: "UP",
    KeyA: "LEFT",
    KeyS: "DOWN",
    KeyD: "RIGHT",
    ArrowUp: "UP",
    ArrowLeft: "LEFT",
    ArrowDown: "DOWN",
    ArrowRight: "RIGHT",
}
