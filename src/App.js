import * as THREE from 'three'
import React, { useRef, Suspense } from 'react'
import { Canvas, extend, useFrame, useLoader } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import './App.css'
import { MeshStandardMaterial, PlaneBufferGeometry } from 'three'

const Scene = () => {
  return (
    <Canvas>
      <pointLight position={[10, 10, 10]}>
        <mesh>
          <planeBufferGeometry args={[3, 5]} />
          <meshStandardMaterial color='lightblue'/>
        </mesh>
      </pointLight>
    </Canvas>
  )
}

const App = () => {
  return <Scene />
}

export default App