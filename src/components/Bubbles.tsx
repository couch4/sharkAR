import { FC, useMemo } from 'react'
import { TextureLoader } from 'three'
import BubbleTex from '../assets/textures/bubble.png'

const Bubbles:FC = () => {
    const bubbleSprite = new TextureLoader().load( BubbleTex );

    const [positions] = useMemo(() => {
      const pos = [];
      for (let i = 0; i < 50; i++) {
       pos.push(5 - Math.random() * 10);
       pos.push(5 - Math.random() * 10);
       pos.push(5 - Math.random() * 10);
    
      }
      return [new Float32Array(pos)];
     }, []);

  return positions && (
      <points>
        <bufferGeometry attach="geometry">
          <bufferAttribute 
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial attach="material" map={bubbleSprite} transparent polygonOffset depthTest polygonOffsetFactor={1} polygonOffsetUnits={0.1} />
      </points>
    )
}

export default Bubbles;

