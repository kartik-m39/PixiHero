export const TILE_SIZE = 32;

// However ty actual no of cols is 25 and rows is 16 but we add 1 extra for boundary
export const COLS = 26;
export const ROWS = 17;

export const GAME_WIDTH = TILE_SIZE * COLS - TILE_SIZE*2;
export const GAME_HEIGHT = TILE_SIZE * ROWS - TILE_SIZE*2;

export const OFFSET_X = 0;
export const OFFSET_Y = TILE_SIZE/2;

export const DEFAULT_POS_X = TILE_SIZE * 10;    // 10 tiles to the right
export const DEFAULT_POS_Y = TILE_SIZE * 15;    // 15 tiles from the top

export const MOVE_SPEED = 0.03;
export const ANIMATION_SPEED = 0.2;
export const ZOOM = 2.5;


