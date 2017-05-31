import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert} from 'react-native';
import Expo from 'expo'
import * as THREE from 'three'

console.ignoredYellowBox = ['THREE']

const {width, height} = Dimensions.get('window')
const {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  DataTexture
} = THREE

const ThreeView = Expo.createTHREEViewClass(THREE)
export default class App extends Component {
  meshes = []

  componentWillMount () {
    this.setupScene()
    this.loadTestContent()
    this.loadPano()
  }

  setupScene () {
    this.scene = new Scene()
    this.scene.name = 'scene'

    this.camera = new PerspectiveCamera(75, width / height, .01, 1000)
    this.camera.name = 'perspective-camera'
    this.camera.target = new THREE.Vector3(0, 0, 0)
  }

  createMesh (type) {
    return new Mesh(
      new BoxGeometry(3, 3, 3),
      new MeshBasicMaterial({
        color: 0x00ff00
      })
    )
  }

  loadTestContent () {
    let meshCount = 6

    while (meshCount) {
      const mesh = this.createMesh()
      mesh.position.set(0, -15 + meshCount * 5, -25)
      mesh.lookAt(this.camera.position)
      this.scene.add(mesh)
      this.meshes.push(mesh)
      meshCount--
    }
  }

  async loadPano () {
    console.log('loadPano')
    global.document = {}
    const {ThreeView} = this

    // const panoAsset = Expo.Asset.fromModule(require('./360-img.jpg'))
    const panoAsset = Expo.Asset.fromModule(require('./test.jpg'))
    await panoAsset.downloadAsync()
    console.log('panoAsset', panoAsset)

    const panoGeometry = new THREE.SphereGeometry(100, 60, 40)
    panoGeometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1))
    console.log('panoGeometry', panoGeometry)

    // https://threejs.org/docs/index.html#api/textures/DataTexture
    const texture = new DataTexture(panoAsset.uri, panoAsset.width, panoAsset.height)

    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.needsUpdate = true
    texture.isDataTexture = true

    const panoMaterial = new MeshBasicMaterial({map: texture})

    console.log('panoMaterial', panoMaterial)

    const panoMesh = new THREE.Mesh(panoGeometry, panoMaterial)
    panoMesh.material.side = THREE.BackSide
    panoMesh.name = 'pano'
    console.log('panoMesh', panoMesh)

    this.scene.add(panoMesh)
  }

  update = (dt) => {
    this.meshes.forEach((mesh) => {
      mesh.rotation.x += 1 * dt
      mesh.rotation.y += 2 * dt
    })
  }

  render() {
    return (
      <ThreeView
        style={{flex: 1}}
        backgroundColor={'#111111'}
        scene={this.scene}
        camera={this.camera}
        tick={this.update}
      />
    )
  }
}
