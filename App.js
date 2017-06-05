import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'
import {StyleSheet, Text, View, Dimensions, Alert, WebView} from 'react-native'
import webapp from './webapp/index.html'

export default class App extends Component {
  state = {
    imgUrl: '360image.JPG'
  }

  // componentDidMount () {
  //   // we must call createTemplate here on the initial load to avoid some odd react errors
  //   this.setState({
  //     aframeTemplate: this.createTemplate()
  //   })
  //
  //   setTimeout(() => {
  //     this.setState({
  //       imgUrl: '360image2.JPG'
  //     })
  //   }, 5000)
  // }

  // componentDidUpdate () {
  //   const template = this.createTemplate()
  //
  //   this.webview.injectJavaScript(`
  //     var container = document.querySelector('.template')
  //     container.innerHTML = '${template}'
  //   `)
  // }

  handleMessage(evt) {
    var message = evt.nativeEvent.data
    console.log('evt.nativeEvent.data: ', message)
    switch(message) {
      case 'domLoaded':
        this.webview.injectJavaScript(`
          var container = document.querySelector('.aframe-container')
          var updateEvent = new CustomEvent('updateAframe', {detail: {imgUrl: '360image.JPG'}})
          container.dispatchEvent(updateEvent)
        `)
        break
      default:
        break
    }
  }

  createTemplate(imgUrl = this.state.imgUrl) {
    {/* <a-scene antialias="true">

          {blurs.map((blur, i) => {
            return (
              <a-entity
                click-drag
                drag-handler={blur.position}
                geometry="primitive: circle"
                height="10"
                id={blur.id}
                key={`blur-${i}`}
                look-at="#camera"
                material="color: #95A7B1"
                position={blur.position}
                resizable
                width="10"
              />
            )
          })}

          <a-sphere id="cast-sphere" sphere-listener {...shpere} />

          {hotspots.map((hotspot, i) => {
            const active = activeHotspotId && activeHotspotId === hotspot.id
            let entity = null

            if (active) {
              entity = (
                <a-entity
                  data-hotspot={JSON.stringify(hotspot)}
                  geometry="primitive: circle"
                  material={`shader: flat; src: #${hotspot.type}-icon; color: #ff4081`}
                  key={i}
                  icon-listener
                  class="hotspot-entity"
                  id={hotspot.id}
                  look-at="#camera"
                  radius="0.5"
                  position={hotspot.position}
                />
              )
            } else {
              entity = (
                <a-entity
                  data-hotspot={JSON.stringify(hotspot)}
                  geometry="primitive: circle"
                  material={`shader: flat; src: #${hotspot.type}-icon`}
                  key={i}
                  icon-listener
                  class="hotspot-entity"
                  id={hotspot.id}
                  look-at="#camera"
                  position={hotspot.position}
                  event-set__enter="_event: mouseenter; material.color: #5DFC0A"
                  event-set__leave="_event: mouseleave; material.color: #12AFCB"
                />
              )
            }

            return entity
          })}
        </a-scene> */}

    return ReactDOMServer.renderToStaticMarkup(
      <a-scene antialias="true">
        <a-assets>
          <img id="info-icon" src={'info.svg'} />
          <img id="move-icon" src={'navigation.svg'} />
          <img id="capture-image" src={imgUrl} />
        </a-assets>

        <a-entity
          scale="1 1 -1"
          material={`shader: flat; src: #capture-image`}
          id="sky"
          geometry="primitive: sphere; radius: 100"
        />

        <a-entity
          position="0 0 0"
          id="camera"
          // rotation={rotation}
          camera={`active: true;`}
          look-controls={`reverseMouseDrag: true; enabled: true`}
          // mouse-cursor="objects: .hotspot-entity"
        >
          <a-cursor fuse="true" fuse-timeout="0" color="yellow" />
        </a-entity>
      </a-scene>
    )
  }

  render() {
    // const {aframeTemplate} = this.state

    return (
      <WebView
        ref={webview => {this.webview = webview}}
        // source={{uri: 'http://localhost:3030'}}
        source={webapp}
        // injectedJavaScript={`
        //   var container = document.querySelector('.template')
        //   container.innerHTML = '${aframeTemplate}'
        // `}
        // injectedJavaScript={`
        //   window.postMessage('injected')
        //   var container = document.querySelector('.aframe-container')
        //   var updateEvent = new Event('updateAframe')
        //   container.dispatchEvent(updateEvent)
        // `}
        style={{marginTop: 20}}
        onMessage={this.handleMessage.bind(this)}
      />
    )
  }
}
