import * as THREE from "three"
import React, { useRef, Suspense } from "react"
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import glsl from "babel-plugin-glsl/macro"
import "./App.css"

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  { uColor: new THREE.Color(0.0, 0.0, 0.0) },

  // Vertex Shader
  glsl`
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * ve4(position, 1.0)
    }
  `,

  // Fragment Shader
  glsl`
    uniform vec3 uColor

    void main() {
      gl_FragColor = vec4(uColor, 1.0)
    }
  `
)

extend({ WaveShaderMaterial })

const Scene = () => {
  return (
    <Canvas>
      <pointLight position={[10, 10, 10]}/>
      <mesh>
        <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
        {/* <meshStandardMaterial color='lightblue'/> */}
        <waveShaderMaterial uColor={"hotpink"}/>
      </mesh>
    </Canvas>
  )
}

const App = () => {
  return (
    <>
      <Scene />
    </>
  )
}

export default App