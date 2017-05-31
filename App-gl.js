import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import {Constants, GLView, Asset} from 'expo'

// map 3d poionts to 2d screen coords
// gets rasterized into pixels
// const createVertexShader = () => (`
//   attribute vec4 coords;
//   attribute float pointSize;
//   void main(void) {
//     gl_Position = coords;
//     gl_PointSize = pointSize;
//   }
// `)

// takes pixels and visually presents them
// const createFramentShader = () => (`
//   precision mediump float;
//   uniform vec4 color;
//   void main(void) {
//     gl_FragColor = color;
//   }
// `)

// const vertexShader = () => (`
//   attribute vec3 position;
//   void main() {
//     gl_Position = vec4(position, 1.0);
//   }
// `)
//
// const fragmentShader = () => (`
//   uniform vec2 resolution;
//   uniform sampler2D texture;
//
//   uniform float fov;
//   uniform float yaw;
//   uniform float pitch;
//
//   const float M_PI = 3.141592653589793238462643;
//   const float M_TWOPI = 6.283185307179586476925286;
//
//   mat3 rotationMatrix (vec2 euler) {
//     vec2 se = sin(euler);
//     vec2 ce = cos(euler);
//     return mat3(ce.x, 0, -se.x,  0, 1, 0, se.x, 0, ce.x) * mat3(1, 0, 0, 0, ce.y, -se.y,  0, se.y, ce.y);
//   }
//
//   vec3 toCartesian (vec2 st) {
//     return normalize(vec3(st.x, st.y, 0.5 / tan(0.5 * radians(fov))));
//   }
//
//   vec2 toSpherical (vec3 cartesianCoord) {
//     vec2 st = vec2(
//       atan(cartesianCoord.x, cartesianCoord.z),
//       acos(cartesianCoord.y)
//   );
//
//     if(st.x < 0.0) {
//       st.x += M_TWOPI;
//     }
//
//     return st;
//   }
//
//   void main (void) {
//     vec2 sphericalCoord = gl_FragCoord.xy / resolution - vec2(0.5);
//     sphericalCoord.y *= -resolution.y / resolution.x;
//     vec3 cartesianCoord = rotationMatrix(radians(vec2(yaw + 180., -pitch))) * toCartesian(sphericalCoord);
//     gl_FragColor = texture2D(texture, toSpherical(cartesianCoord)/vec2(M_TWOPI, M_PI));
//   }
// `)

let gl

export default class App extends Component {
  async loadPano () {
    const panoAsset = Asset.fromModule(require('./360-img.jpg'))
    await panoAsset.downloadAsync()
  }

  onContextCreate = (gl) => {
    // gl = glContext

    const createVertexShaderSource = () => (`
      attribute vec4 a_position;
      void main () {
        gl_Position = a_position;
      }
    `)

    const createFragmentShaderSource = () => (`
      precision mediump float;
      void main () {
        gl_FragColor = vec4(1, 0, 0.5, 1);
      }
    `)

    const vertexShaderSource = createVertexShaderSource()
    const fragmentShaderSource = createFragmentShaderSource()

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)

    var program = createProgram(gl, vertexShader, fragmentShader)


  }

  basicStuff = () => {
    const texture = createTexture('./360-img.jpg')
    console.log('TEXTURE')
    console.log(texture)

    const vertices = [
      -0.9, -0.9, 0.0,
      0.9, -0.9, 0.0,
      0.0,  0.9, 0.0
    ]

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

    const shaderProgram = gl.createProgram()
    gl.linkProgram(shaderProgram)
    gl.useProgram(shaderProgram)

    let i = 3
    while (i) {
      const x = i
      const y = i
      const z = i

      const coords = gl.getAttribLocation(shaderProgram, 'coords')
      gl.vertexAttrib3f(coords, 0, 0, 0)

      const pointSize = gl.getAttribLocation(shaderProgram, 'pointSize')
      gl.vertexAttrib1f(pointSize, 50)

      const color = gl.getUniformLocation(shaderProgram, 'color')
      gl.uniform4f(color, 1, 0, 1, 1)

      // Compile vertex shader
      const vert = createVertexShader()
      const vertexShader = gl.createShader(gl.VERTEX_SHADER)
      gl.shaderSource(vertexShader, vert)
      gl.compileShader(vertexShader)

      // Compile fragment shader
      const frag = createFramentShader()
      const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)

      gl.shaderSource(fragmentShader, frag)
      gl.compileShader(fragmentShader)
      gl.attachShader(shaderProgram, vertexShader)
      gl.attachShader(shaderProgram, fragmentShader)

      i--
    }

    gl.clearColor(0, 0, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.drawArrays(gl.POINTS, 0, 1)
    gl.flush()
    gl.endFrameEXP()

    // this.animate()
  }

  animate = () => {
    const {gl} = this
    //   // Bind buffer, program and position attribute for use
    //   gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      // gl.useProgram(program)
    //   gl.enableVertexAttribArray(positionAttrib)
    //   gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0)
    //
    //   // Buffer data and draw!
    //   const speed = this.props.speed || 1
    //   const a = 0.48 * Math.sin(0.001 * speed * Date.now()) + 0.5
    //   const verts = new Float32Array([
    //     -a, -a, a, -a, -a,  a,
    //     -a,  a, a, -a,  a,  a,
    //   ])
    //   gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW)
      gl.drawArrays(gl.POINTS, 0, 1)

    // Submit frame
    gl.flush()
    gl.endFrameEXP()

    requestAnimationFrame(this.animate)
  }

  render () {
    return (
      <View style={styles.container}>
        <GLView
          style={StyleSheet.absoluteFill}
          onContextCreate={this.onContextCreate}
        />
      </View>
    )
  }
}

function createShader (gl, type, source) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    console.log(gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return false
  }

  return shader
}

function createProgram (gl, vertexShader, fragmentShader) {
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  var success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    console.log(gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return false
  }

  return program
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
})


// async function createTexture (imgSrc) {
//   const asset = Asset.fromModule(require('./360-img.jpg'))
//   await asset.downloadAsync()
//   console.log('ASSET')
//   console.log(JSON.stringify(asset, null, 2))
//
//   const texture = gl.createTexture()
//   gl.bindTexture(gl.TEXTURE_2D, texture);
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
//
//   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.localUri);
//   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//   // gl.bindTexture(gl.TEXTURE_2D, null);
//   // texture.image = asset
//   //
//   return texture
// }
//
// function updateTexture() {
//   gl.bindTexture(gl.TEXTURE_2D, video_texture)
//   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
//   gl.bindTexture(gl.TEXTURE_2D, null)
// }
//
// function createProgram (vertex, fragment) {
//   const program = gl.createProgram()
//   const vertexShader = createShader(vertex, gl.VERTEX_SHADER)
//   const fragmentShader = createShader('#ifdef GL_ES\nprecision highp float;\n#endif\n\n' + fragment, gl.FRAGMENT_SHADER)
//
//   if (!vertexShader || !fragmentShader) { return null }
//
//   gl.attachShader(program, vertexShader)
//   gl.attachShader(program, fragmentShader)
//
//   gl.deleteShader(vertexShader)
//   gl.deleteShader(fragmentShader)
//
//   gl.linkProgram(program)
//
//   if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//     let errorMessage = `
//       VALIDATE_STATUS: ${gl.getProgramParameter(program, gl.VALIDATE_STATUS)}
//       ERROR: ${gl.getError()}
//       - Vertex Shader - ${vertex}
//       - Fragment Shader - ${fragment}
//     `
//
//     console.log(errorMessage)
//
//     return null
//   }
//
//   return program
// }
