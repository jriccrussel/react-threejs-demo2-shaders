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

    // exture
    uTexture: new THREE.Texture(),
  },
  // Vertex Shader
  glsl`
    // Determine Precision the GPU uses when calculating floats
    precision mediump float;

    // Gradient
    varying vec2 vUv;
    varying float vWave;

    // Time
    uniform float uTime;

    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);


    void main() {
      // Gradient
      vUv = uv;

      // Wave Effect
      vec3 pos = position;
      float noiseFreq = 2.0;
      float noiseAmp = 0.4;
      vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
      pos.z += snoise3(noisePos) * noiseAmp;
      vWave = pos.z;
      
      // Position
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    // Determine Precision the GPU uses when calculating floats
    precision mediump float;

    // Solid Color
    uniform vec3 uColor;

    // Time
    uniform float uTime;

    // Load Texture
    uniform sampler2D uTexture;

    varying vec2 vUv;
    varying float vWave;

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

      // Shade Move left to right
      // gl_FragColor = vec4(sin(vUv.x + uTime) * uColor, 1.0)

      float wave = vWave * 0.2;
      vec3 texture = texture2D(uTexture, vUv + wave).rgb;
      gl_FragColor = vec4(texture, 1.0);
    }
  `
)

extend({ WaveShaderMaterial })

const Wave = () => {
  const ref = useRef()

  // Time
  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()))

  // Load Texture
  const [image] = useLoader(THREE.TextureLoader, [
    "https://images.unsplash.com/photo-1604011092346-0b4346ed714e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1534&q=80",
  ])

  return (
    <mesh>
      <planeBufferGeometry args={[0.4, 0.6, 16, 16]} />
      <waveShaderMaterial uColor={"hotpink"} ref={ref} uTexture={image} />
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
      <h1>POMADA MODELADORA</h1>
      <Scene />
    </>
  )
}

export default App
