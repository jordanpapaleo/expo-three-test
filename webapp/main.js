(function() {
  'use strict'

  // https://glitch.com/edit/#!/aframe-gallery?path=index.html:41:0
  const registeredComponents = []

  checkforAframe()

  function checkforAframe () {
    var AFRAME = window.AFRAME
    if (AFRAME) {
      registerComponents()
    } else {
      dispatch('AFRAME not loaded')
      setTimeout(() => {
        checkforAframe()
      }, 300)
    }
  }

  function handleClick () {
    dispatch('here')
  }

  function dispatch (message) {
    if (typeof message === 'object') {
      window.postMessage(JSON.stringify(message))
    } else {
      window.postMessage(JSON.stringify({message}))
    }
  }

  function registerComponents () {
    // if (!AFRAME.components['sphere-listener']) registerSphereListener()
    // if (!AFRAME.components['resizable']) registerResizable()
    // if (!AFRAME.components['drag-handler']) registerDraghandler()
    // if (!AFRAME.components['icon-listener']) registerIconListener()
  }

  // Used to as a target to capture raycasts intersections for placement of hotspots
/*  function registerSphereListener () {
    window.registeredComponents.push('sphere-listener')
    AFRAME.registerComponent('sphere-listener', {
      init () {
        // const {el} = this
        // el.addEventListener('mouseup', (evt) => {
        //   const camera = document.querySelector('#camera')
        //   // viewer.handleRaycastUpdate(evt.detail.intersection.point, camera.components.rotation)
        // })
      }
    })
  }

  function registerResizable () {
    window.registeredComponents.push('resizable')
    AFRAME.registerComponent('resizable', {
      init () {
        // const {el} = this
        //
        // el.addEventListener('mousedown', (evt) => {
        // })
        //
        // el.addEventListener('mouseup', (evt) => {
        //   const geometry = el.getAttribute('geometry')
        //
        //   // el.setAttribute('geometry', {
        //   //   ...geometry,
        //   //   width: geometry.width + 0.2,
        //   //   height: geometry.height + 0.2
        //   // })
        // })
      }
    })
  }

  function registerDraghandler () {
    window.registeredComponents.push('drag-handler')
    AFRAME.registerComponent('drag-handler', {
      schema: {
        default: '0 0 0',
        type: 'string'
      },
      init () {
        // const {el} = this
        //
        // el.addEventListener('dragstart', (evt) => {
        //   // viewer.setState({enableLook: false})
        // })
        //
        // el.addEventListener('dragend', (evt) => {
        //   const position = evt.target.getAttribute('position')
        //   const id = evt.target.getAttribute('id')
        //   // viewer.handleBlurMove(id, position)
        //   // viewer.setState({enableLook: true})
        // })
      }
    })
  }

  function registerIconListener () {
    window.registeredComponents.push('icon-listener')
    AFRAME.registerComponent('icon-listener', {
      init () {
        // const {el} = this
        // el.addEventListener('click', (evt) => {
        //   // viewer.handleHotspotClick(JSON.parse(el.dataset.hotspot))
        // })
      }
    })
  }
*/
  var plop = {
    handleBlurMove (id, position) {
      dispatch({
        type: 'editBlur',
        payload: {id, position}
      })
    },
    handleHotspotClick = (hotspot) => {
      const action = hotspot.type === 'info' ? 'showInfo' : 'changeRoom'
      dispatch({
        type: action,
        payload: hotspot
      })
    },
    handleZoom (deltaY) {
      dispatch({
        type: 'zoom',
        payload: deltaY
      })
    },
    handleRaycastUpdate (position, rotation) {
      dispatch({
        type: 'lastCast',
        payload: 'todo'
      })

      // this.setState({
      //   lastCast: {
      //     position: {...position},
      //     rotation: {...rotation.data}
      //   }
      // }, () => {
      //
      //     cb('lastCast', this.state.lastCast)
      //
      // })
    }
  }
}())
