import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'
import {StyleSheet, Text, View, Dimensions, Alert, WebView} from 'react-native'
import webapp from './webapp/index.html'

export default class App extends Component {
  state = {
    imgUrl: '360image.JPG'
  }

  componentDidMount () {
    // setTimeout(() => {
    //   this.setState({
    //     imgUrl: '360image2.JPG'
    //   })
    // }, 5000)
  }

  componentDidUpdate () {
    const template = this.updateTemplate()

    this.webview.injectJavaScript(`
      var container = document.querySelector('.template')
      container.innerHTML = '${template}'
    `)
  }

  handleMessage(evt) {
    console.log(JSON.parse(evt.nativeEvent.data))
  }

  updateTemplate() {
    const {imgUrl} = this.state
    const geometry = `primitive: plane; height: 1; width: 1`
    const evtSet1 = `_event: mousedown; scale: 1 1 1`
    const evtSet2 = `_event: mouseup; scale: 1.2 1.2 1`
    const evtSet3 = `_event: mouseenter; scale: 1.2 1.2 1`
    const evtSet4 = `_event: mouseleave; scale: 1 1 1`
    const props = {
      // geometry: geometry,
      // class: 'link',
      'event-set__1': evtSet1,
      'event-set__2': evtSet2,
      'event-set__3': evtSet3,
      'event-set__4': evtSet4
    }

    if (!imgUrl) return []

    const markup = [
      `<a-scene antialias="true">`,
        `<a-assets>`,
          `<img id="city" crossorigin="anonymous" src="${imgUrl}">`,
          `<img id="cubes" crossorigin="anonymous" src="${imgUrl}">`,
          `<img id="city" crossorigin="anonymous" src="${imgUrl}">`,
          `<img id="sechelt" crossorigin="anonymous" src="${imgUrl}">`,
        `</a-assets>`,
        // `<a-sky id="image-360" radius="10" src="#city"></a-sky>`,
        `<a-entity id="links" layout="type: line; margin: 1.5" position="0 0 -4">`,
          `<a-entity class="link" geometry="${geometry}" material="shader: flat; src: #cubes" event-set__1="${evtSet1}" event-set__2="${evtSet2}" event-set__3="${evtSet3}" event-set__4="${evtSet4}"></a-entity>`,
          // `<a-entity class="link" geometry="${geometry}" material="shader: flat; src: #cubes" event-set__1="${evtSet1}" event-set__2="${evtSet2}" event-set__3="${evtSet3}" event-set__4="${evtSet4}"></a-entity>`,
          // `<a-entity class="link" geometry="${geometry}" material="shader: flat; src: #city" event-set__1="${evtSet1}" event-set__2="${evtSet2}" event-set__3="${evtSet3}" event-set__4="${evtSet4}"></a-entity>`,
          // `<a-entity class="link" geometry="${geometry}" material="shader: flat; src: #sechelt" event-set__1="${evtSet1}" event-set__2="${evtSet2}" event-set__3="${evtSet3}" event-set__4="${evtSet4}"></a-entity>`,
        `</a-entity>`,
        `<a-entity id="camera" camera look-controls>`,
          `<a-cursor id="cursor" animation__click="property: scale; startEvents: click; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150" animation__fusing="property: fusing; startEvents: fusing; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500" event-set__1="_event: mouseenter; color: springgreen" event-set__2="_event: mouseleave; color: black" fuse="true" raycaster="objects: .link"></a-cursor>`,
        `</a-entity>`,
      `</a-scene>`
    ]

    return markup.join('')
  }

  render() {
    const template = this.updateTemplate()

    return (
      <WebView
        ref={webview => {this.webview = webview}}
        source={webapp}
        injectedJavaScript={`
          var container = document.querySelector('.template')
          container.innerHTML = '${template}'
        `}
        style={{marginTop: 20}}
        onMessage={this.handleMessage}
      />
    )
  }
}
