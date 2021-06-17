import { FC, useState, useEffect, useMemo, useRef, Suspense } from 'react';
import { ZapparCamera, InstantTracker } from '@zappar/zappar-react-three-fiber';
import { isMobile } from 'react-device-detect'
import { AdditiveBlending, AudioListener, AudioLoader, Clock, DirectionalLight, PositionalAudio, SpotLight } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import webAudioTouchUnlock from 'web-audio-touch-unlock'
// @ts-ignore
import Shark from '../assets/mesh/sharkDraco.glb'
// @ts-ignore
import Jaws from '../assets/music/jaws.ogg'
import Model from './Model'
import Bubbles from './Bubbles';

const Scene: FC = () => {
  const [placementMode, setPlacementMode] = useState(true)
  const { camera, scene } = useThree()
  const clock = useRef(new Clock());
  const sharkScene = useRef(null)
  const mainRef = useRef(null)
  const light = useMemo(() => new SpotLight(0xf2e7aa), [])
  const sun = useMemo(() => new DirectionalLight(0xf2e7aa), [])
  const [seaColour,setSeaColour] = useState(0x000f46)

  useEffect(() => {
    if(mainRef?.current)
    // @ts-ignore
    mainRef.current.addEventListener('touchend', startAudio)
  },[mainRef])

  const startAudio = () => {
    let context = new (window.AudioContext || window.webkitAudioContext)()
    context.resume()
    webAudioTouchUnlock(context)
      .then(function (unlocked) {
          if(unlocked) {
            console.log('audio unlocked')
          } else {
              console.log('audio not unlocked')
          }
      }, function(reason) {
          console.error(reason);
      });
      
      const listener = new AudioListener();
      camera.add( listener );
      const sound = new PositionalAudio( listener );

      const audioLoader = new AudioLoader();
      audioLoader.load( Jaws, function( buffer ) {
        sound.setBuffer( buffer )
        sound.setLoop( true )
        sound.setVolume( 0.7 )
        sound.play()
      })
  }

  useEffect(() => {
    if(sharkScene && sharkScene.current && !placementMode) {
      // @ts-ignore
      sharkScene.current.rotation.order= "XZY"

      if (isMobile){
        // @ts-ignore
        sharkScene.current.rotation.z = Math.PI/2
      }       
    }
  },[placementMode,sharkScene])

  useFrame(() => {
    const delta = clock.current.getDelta();
    const elapsed = clock.current.getElapsedTime()
    const wave = Math.cos(elapsed)*0.5

    if(sharkScene && sharkScene.current && !placementMode) {
      // @ts-ignore
      sharkScene.current.rotation.y += delta*0.2
      
      // @ts-ignore
      sharkScene.current.position.x = wave
    }

      sun.intensity = 10-wave*2
      sun.target.position.x = wave*30
      sun.target.position.z = wave
  })

  const handleModelLoaded = () => {
    setPlacementMode(false)
  }

  return (
    <group ref={mainRef} onClick={startAudio}>
      <ZapparCamera poseMode="anchor-origin">
        <mesh position={[0,0,-100]}>
          <planeGeometry attach="geometry" args={[1000, 1000]} />
          <meshBasicMaterial attach="material" color={0x020617} opacity={0.8} transparent/>
        </mesh>
        <mesh position={[0,0,-1]}>
          <planeGeometry attach="geometry" args={[1000, 1000]} />
          <meshBasicMaterial attach="material" color={seaColour}  transparent blending={AdditiveBlending}/>
        </mesh>
        <primitive object={light} position={[0, 0, 1]} intensity={4} angle={Math.PI/10} decay={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} penumbra={1} />
        <primitive object={light.target}  />
      </ZapparCamera>
      <InstantTracker placementMode={placementMode} placementCameraOffset={[0, 0, 5]}>
        <group ref={sharkScene}>
          <Suspense fallback={null}>
            <Model url={Shark} isLoaded={handleModelLoaded} />
          </Suspense>
        </group>
        <Bubbles />
      </InstantTracker>
      <primitive object={sun} position={[2.5, 20, 5]} intensity={10.5} color={0x96a6e3} castShadow/>
      <primitive object={sun.target} />
    </group>
  )
}

export default Scene

