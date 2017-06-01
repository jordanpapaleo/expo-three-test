import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'
import {StyleSheet, Text, View, Dimensions, Alert, WebView} from 'react-native'
import webapp from './webapp/index.html'

export default class App extends Component {
  state = {
    imgUrl: '360image.JPG'
  }

  componentDidMount () {
    // we must call createTemplate here on the initial load to avoid some odd react errors
    this.setState({
      aframeTemplate: this.createTemplate()
    })

    setTimeout(() => {
      this.setState({
        imgUrl: '360image2.JPG'
      })
    }, 5000)
  }

  componentDidUpdate () {
    const template = this.createTemplate()

    this.webview.injectJavaScript(`
      var container = document.querySelector('.template')
      container.innerHTML = '${template}'
    `)
  }

  handleMessage(evt) {
    console.log('evt.nativeEvent.data: ', evt.nativeEvent.data)
  }

  createTemplate(imgUrl = this.state.imgUrl) {

    return ReactDOMServer.renderToStaticMarkup(
      <a-scene antialias="true">
        <a-entity
          scale="1 1 -1"
          material={`shader: flat; src: ${imgUrl}`}
          id="sky"
          geometry="primitive: sphere; radius: 100"
        />
      </a-scene>
    )
  }

  render() {
    const {aframeTemplate} = this.state

    return (
      <WebView
        ref={webview => {this.webview = webview}}
        source={webapp}
        injectedJavaScript={`
          var container = document.querySelector('.template')
          container.innerHTML = '${aframeTemplate}'
        `}
        style={{marginTop: 20}}
        onMessage={this.handleMessage}
      />
    )
  }
}
