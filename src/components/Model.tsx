import { FC, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { AnimationMixer, Clock, TextureLoader } from 'three'
import bodyTex from '../assets/textures/sharkTexture.jpg'
import mouthTex from '../assets/textures/sharkTexture.jpg'
import { Scene } from '@babylonjs/core'

interface ModelProps {
  isLoaded: () => void
  url: string
}

const Model:FC<ModelProps> = ({ isLoaded, url }) => {
  const model = useGLTF(url)
  const clock = useRef(new Clock());

  const mixer = new AnimationMixer( model.scene );
	var action = mixer.clipAction( model.animations[ 0 ] );
	action.play();

  useEffect(() => {
    isLoaded()
  },[])

  useFrame(() => {
    if (mixer) {
      const delta = clock.current.getDelta();
      mixer.update(delta);
    }
  });
 
  useMemo(() => {
    const bodyMat = model.materials['body']
    const mouthMat = model.materials['mouth']
    const bodyTexLoaded = new TextureLoader().load(bodyTex)
    bodyTexLoaded.flipY = false
    const mouthTexLoaded = new TextureLoader().load(mouthTex)
    mouthTexLoaded.flipY = false
   
    // @ts-ignore
    bodyMat.map = bodyTexLoaded
    // @ts-ignore
    mouthMat.map = mouthTexLoaded
    const sharkMesh = model.nodes['SharkBody']
    model.scene.rotation.y = 90
  }, [model.materials])

  return (
      <primitive object={model.scene} scale={0.05} position={[0,0,20]}/>
    )
}

export default Model;

