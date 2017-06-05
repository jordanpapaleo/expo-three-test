document.querySelector('.aframe-container').addEventListener('updateAframe', (evt) => {
  window.postMessage('update event')
  updateAframe(evt.detail)
})


function handleClick() {
  window.postMessage('message')
}

function updateAframe({imgUrl, hotspots}) {
  window.postMessage('updateAframe: ' + imgUrl)
  const template = ReactDOMServer.renderToStaticMarkup(
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


  const container = document.querySelector('.aframe-container')
  container.innerHTML = template
}

window.postMessage('domLoaded')
