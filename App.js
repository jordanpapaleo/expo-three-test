import React, { Component } from 'react';
import { StyleSheet, Text, View, Dimensions, Alert } from 'react-native';
import Expo from 'expo';
import * as THREE from 'three';

console.ignoredYellowBox = ['THREE'];

const { width, height } = Dimensions.get('window');
const {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  DataTexture,
} = THREE;

const textureModules = {
  'asset-test': require('./avatar2.png'),
};

const Assets = {
  'asset-test': Expo.Asset.fromModule(textureModules['asset-test']),
};

const ThreeView = Expo.createTHREEViewClass(THREE);
export default class App extends Component {
  meshes = [];

  constructor() {
    super();
    this.scene = new Scene();
    this.scene.name = 'scene';

    this.camera = new PerspectiveCamera(75, width / height, 0.01, 1000);
    this.camera.name = 'perspective-camera';
    this.camera.target = new THREE.Vector3(0, 0, 0);
  }

  async componentWillMount() {
    await Assets['asset-test'].downloadAsync();

    this.loadTestContent();
    this.setState({ loaded: true });
  }

  createMesh(type) {
    const texture = ThreeView.textureFromAsset(Assets['asset-test']);

    return new Mesh(
      new BoxGeometry(3, 3, 3),
      new MeshBasicMaterial({
        color: 0x00ff00,
        map: texture,
      })
    );
  }

  loadTestContent() {
    let meshCount = 6;

    while (meshCount) {
      const mesh = this.createMesh();
      mesh.position.set(0, -15 + meshCount * 5, -25);
      mesh.lookAt(this.camera.position);
      this.scene.add(mesh);
      this.meshes.push(mesh);
      meshCount--;
    }
  }

  update = dt => {
    this.meshes.forEach(mesh => {
      mesh.rotation.x += 1 * dt;
      mesh.rotation.y += 2 * dt;
    });
  };

  render() {
    return (
      <ThreeView
        style={{ flex: 1 }}
        backgroundColor={'#111111'}
        scene={this.scene}
        camera={this.camera}
        tick={this.update}
      />
    );
  }
}
