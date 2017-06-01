import React, {Component} from 'react'
import ReactDOMServer from 'react-dom/server'
import {StyleSheet, Text, View, Dimensions, Alert, WebView} from 'react-native'
import webapp from './webapp/index.html'

export default class App extends Component {
  state = {
    imgUrl: '360image.JPG'
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        imgUrl: '360image2.JPG'
      })
    }, 5000)
  }

  componentDidUpdate () {
    const template = this.updateTemplate()

    this.webview.injectJavaScript(`
      var container = document.querySelector('.template')
      container.innerHTML = '${template}'
    `)
  }

  handleMessage(evt) {
    console.log('evt.nativeEvent.data: ', evt.nativeEvent.data)
  }

  updateTemplate() {
    const {imgUrl} = this.state
    const markup = [
      `<a-scene antialias="true">`,
        `<a-entity scale="1 1 -1" material="shader: flat; src: ${imgUrl}" id="sky" geometry="primitive: sphere; radius: 100" />`,
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
