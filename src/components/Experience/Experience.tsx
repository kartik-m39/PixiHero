import { Application, extend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite } from "pixi.js";
import { useCallback, useEffect,useState } from "react";
import { calculateCanvasSize } from "../../helpers/common";
import { Level } from "../Levels/Level";
import { Hero } from "../Hero/Hero";
import { TILE_SIZE } from "../../constants/game-world";
import { Camera } from "../Camera/Camera";

// extend tells @pixi/react what Pixi.js components are available
extend({
  Container,
  Graphics,
  Sprite,
});

export const Experience = () => {
    const [heroPosition, setHeroPosition] = useState({x:0, y:0});
    const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);
    const [background, setBackground] = useState(undefined);
    const [HeroTexture, setHeroTexture] = useState(undefined);


    // using callback as we do not want recreation of the function during each re-render
    const updateHeroposition = useCallback((x: number, y: number) => {

      // using floor as we want to snap our hero within the grid based system
      setHeroPosition({
        x: Math.floor(x / TILE_SIZE),
        y: Math.floor(y / TILE_SIZE)
      })
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





  return (
    // We'll wrap our components with an <Application> component to provide the Pixi.js Application context
    <Application width={canvasSize.width} height={canvasSize.height}>
        <pixiContainer>

            {/* Pssing the height and width explicitly so that if the main container size changes the sprite size should also change accordingly */}
            <pixiSprite texture={background} width={canvasSize.width} height={canvasSize.height}/>

            <Camera canvasSize={canvasSize} heroPosition={heroPosition}>
              <Level/>
              <Hero texture={HeroTexture} onMove={updateHeroposition}/>
            </Camera>

 
        </pixiContainer>


    </Application>
  );
};
