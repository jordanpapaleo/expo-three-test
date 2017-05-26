import * as THREE from 'three'

const {
  RingGeometry,
  MeshBasicMaterial,
  Mesh,
  Clock,
  Vector3,
  Raycaster
} = THREE

const DEFAULT_CURSOR = function () {
  const geometry = new RingGeometry(1, 1, 32)
  const material = new MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide
  })

  const ring = new Mesh(geometry, material)
  ring.material.transparent = true
  ring.material.opacity = 1
  ring.position.z = -1
  return ring
}

export default class Cursor {
  state = {
    fuzeTarget: null,
    fuzeStartTime: 0
  }

  collidableItems = []
  raycast = new Raycaster()
  clock = new Clock(true)

  constructor (camera, fuzeTimeout = 2, cursor = DEFAULT_CURSOR()) {
    if (!camera) {
      throw new Error('A camera is required')
    }
    camera.add(cursor)
    this.props = {camera, fuzeTimeout}
  }

  setState (nextState, cb) {
    Object.keys(nextState).forEach((key) => {
      this.state[key] = nextState[key]
    })

    if (cb instanceof Function) { cb(this.state) }
  }

  addItem (mesh) {
    this.collidableItems.push(mesh)
  }

  removeItem (mesh) {
    this.collidableItems = this.collidableItems.filter(item => item.uuid !== mesh.uuid)
  }

  update = () => {
    this.updateRaycaster()
    this.onCollision()
  }

  updateRaycaster = () => {
    const {camera} = this.props
    const vector = new Vector3(0, 0, 0)
    vector.unproject(camera)

    this.raycast.set(
      camera.position,
      vector.sub(camera.position).normalize()
    )
  }

  onCollision = () => {
    const {fuzeTarget} = this.state
    const {raycast, fuzeController, onFuzeEnd, collidableItems, clock} = this
    const intersects = raycast.intersectObjects(collidableItems)

    if (intersects.length) {
      const firstIntersected = intersects[0].object
      if (firstIntersected) {
        const lastCollisionTime = clock.getElapsedTime()
        fuzeController(firstIntersected, lastCollisionTime)
      }
    } else {
      if (fuzeTarget) {
        onFuzeEnd()
      }
    }
  }

  fuzeController = (mesh, lastCollisionTime) => {
    const {fuzeTarget} = this.state
    const {onStartFuze, onFuzing, onFuzeEnd} = this

    if (!fuzeTarget) {
      onStartFuze(mesh, lastCollisionTime)
    } else if (fuzeTarget === mesh) {
      onFuzing(lastCollisionTime)
    } else {
      // This will occur when moving from overlapping fuseTargets
      onFuzeEnd()
    }
  }

  onStartFuze = (mesh, lastCollisionTime) => {
    this.setState({
      fuzeTarget: mesh,
      fuzeStartTime: lastCollisionTime
    }, (newState) => {
      const {fuzeTarget} = newState

      if (fuzeTarget.onFuzing instanceof Function) {
        fuzeTarget.onFuzing()
      }
    })
  }

  onFuzing = (lastCollisionTime) => {
    const {fuzeStartTime, fuzeTarget} = this.state
    const {fuzeTimeout} = this.props

    if (fuzeTarget.fuzed) {
      return
    }

    // Fuze time has exceeded the timeout and is Fused
    if ((lastCollisionTime - fuzeStartTime) >= fuzeTimeout) {
      fuzeTarget.fuzed = true

      if (fuzeTarget.onFuzed instanceof Function) {
        fuzeTarget.onFuzed()
      }
    } else {
      // Its still fusing
      if (fuzeTarget.onFusing instanceof Function) {
        fuzeTarget.onFusing()
      }
    }
  }

  onFuzeEnd = () => {
    const {fuzeTarget} = this.state
    delete fuzeTarget.fuzed

    if (fuzeTarget && fuzeTarget.onFuzeEnd instanceof Function) {
      fuzeTarget.onFuzeEnd()
    }

    this.setState({
      fuzeStartTime: null,
      fuzeTarget: null
    })
  }
}
