import * as THREE from "three"
import React, { useRef, Suspense } from "react"
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"
import glsl from "babel-plugin-glsl/macro"
import "./App.css"

const WaveShaderMaterial = shaderMaterial(
  // Uniform
  { 
    // Time
    uTime: 0,

    // Gradient
    uColor: new THREE.Color(0.0, 0.0, 0.0),
  },

  // Vertex Shader
  glsl`
    // Gradient
    varying vec2 vUv

    // Time
    uniform float uTime

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

    void main() {
      // Gradient
      vUv = uv

      // Wave Effect
      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;

      // Position
      gl_Position = projectionMatrix * modelViewMatrix * ve4(pos, 1.0)
    }
  `,

  // Fragment Shader
  glsl`
    // Determine Precision the GPU uses when calculating floats
    precision mediump float

    // Solid Color
    uniform vec3 uColor

    // Time
    uniform float uTime

    // Gradient
    varying vec2 vUv

    void main() {
      // gl_FragColor = vec4(uColor, 1.0)

      // Gradient X Axis | Multiply Color
      // gl_FragColor = vec4(vUv.x * uColor, 1.0)

      // Gradient Y Axis | Multiply Color
      // gl_FragColor = vec4(vUv.y * uColor, 1.0)

      // Gradient Y Axis | Color Divide
      // gl_FragColor = vec4(vUv.y / uColor, 1.0)

      // Gradient Y Axis | Color Light
      // gl_FragColor = vec4(vUv.y + uColor, 1.0)

      // Gradient Multiple Colors
      // gl_FragColor = vec4(vUv.x, 0.4, 1.0, 1.0)

      // Move left to right
      gl_FragColor = vec4(sin(vUv.x + uTime) * uColor, 1.0)
    }
  `
)

extend({ WaveShaderMaterial })

const Wave = () => {
  const ref = useRef()

  // Time
  useFrame(({clock}) => (ref.current.uTime = clock.getElapsedTime()))

  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={ref}/>
    </mesh>
  )
}

const Scene = () => {
  return (
    <Canvas camera={{ fov: 12, position: [0, 0, 5] }}>
      {/* <pointLight position={[10, 10, 10]}/>
      <mesh>
        <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
        <meshStandardMaterial color='lightblue'/>
        <waveShaderMaterial uColor={"hotpink"}/>
      </mesh> */}
      <Suspense fallback={null}>
        <Wave />
      </Suspense>
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