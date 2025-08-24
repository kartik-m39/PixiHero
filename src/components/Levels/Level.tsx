import { useEffect, useState } from "react";
import { Assets } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH, OFFSET_X, OFFSET_Y } from "../../constants/game-world";

export const Level = () => {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        Assets.load("/tilemap.png").then(setTexture);
    }, []);

    if (!texture) return null;

    return (

        // Width and height props => controls how big the sprite appears on screen and scales the original image to fit these dimensions

        // x and y => Controls where the sprite is placed on the canvas, {0,0} means it is placed on the top left corner
        
        <pixiSprite texture={texture} width={GAME_WIDTH} height={GAME_HEIGHT} x={OFFSET_X} y={OFFSET_Y} />
    );
};