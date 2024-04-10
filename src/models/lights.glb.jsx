/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.16 lights.glb --root ../ -o ../../src/components/lights.glb.jsx 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/assets/lights.glb')
  return (
    <group {...props} dispose={null}>
      <group />
    </group>
  )
}

useGLTF.preload('/assets/lights.glb')
