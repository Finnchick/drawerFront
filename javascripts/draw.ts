import { Canvas } from './drawingObjects/Canvas'
import { type Figures, type Point } from './helperTypes'
import { Line } from './drawingObjects/Line'
import { Circle } from './drawingObjects/Circle'
import { Rectangle } from './drawingObjects/Rectangle'
import { Sidebar } from './Sidebar'

const canvas = new Canvas()
const sideBar = new Sidebar()

let firstClick: Point | null = null

let currentObject: Figures | null = null
let selectedObject = null

const typeCreatorMap = {
  line: createLine,
  circle: createCircle,
  rectangle: createRectangle,
  cursor
} // convert to ENUM

function cursor (event: MouseEvent): void {
  event.stopPropagation()
}

function createFigure (event: MouseEvent): void {
  if (event.which === 1) {
    const type = sideBar.getSelectedType
    typeCreatorMap[type](event)
    console.log('vit')
  }
}

function createLine (event: MouseEvent): void {
  if (firstClick === null) {
    firstClick = {
      x: event.offsetX,
      y: event.offsetY
    }
  } else {
    const secondClick = {
      x: event.offsetX,
      y: event.offsetY
    }

    const line = new Line()
    line.create(firstClick, secondClick)
    canvas.addObject(line)
    firstClick = null
  }
}

function createRectangle (event: MouseEvent): void {
  if (firstClick === null) {
    firstClick = {
      x: event.offsetX,
      y: event.offsetY
    }
  } else {
    const secondClick = {
      x: event.offsetX,
      y: event.offsetY
    }

    const rectangle = new Rectangle()
    rectangle.create(firstClick, secondClick)
    canvas.addObject(rectangle)
    firstClick = null
  }
}
function createCircle (event: MouseEvent): void {
  const firstClick = {
    x: event.offsetX,
    y: event.offsetY
  }

  const circle = new Circle()
  circle.create(firstClick)
  canvas.addObject(circle)
}

function clearCanvas (event: MouseEvent): void {
  if (event.which === 2) {
    canvas.clear()
  }
}

function cancelChange (event: KeyboardEvent): void {
  // console.log(event.which, event.ctrlKey, String.fromCharCode(event.which))
  if (String.fromCharCode(event.which).toLowerCase() === 'z' && event.ctrlKey) {
    canvas.cancelChange()
  }
}
let startX, startY
function findColliding (event: MouseEvent): void {
  startX = event.offsetX
  startY = event.offsetY
  if (event.which === 2) {
    currentObject = canvas.findColliding(startX, startY)
    console.log(currentObject)
  }
}

function selectFigure (event: MouseEvent): void {
  startX = event.offsetX
  startY = event.offsetY
  if (event.which === 1 && event.ctrlKey) {
    selectedObject = canvas.findColliding(startX, startY)
    selectedObject.select()
    canvas.rePaint()
  }
}

function mouseOut (event: MouseEvent): void {
  if (!currentObject?.isDragging) {
    return
  }

  event.preventDefault()
  currentObject.endMovement()
  //  console.log('mouse out')
  // TODO change only to mouse up event
  currentObject.layDown() // change to setter Q А нахуй я это сделал, если интерфейс всё равно не поменялся? У меня же в методах(сет/гет) ниху не происходит
  canvas.rePaint()
}

function mouseMove (event: MouseEvent): void {
  if (currentObject?.isDragging) { // Q: How to check need we to run this func or not
    const mouseX = event.offsetX
    const mouseY = event.offsetY

    const dx = mouseX - startX
    const dy = mouseY - startY
    // console.log(`canvas ${canvas}, canvas.objects ${canvas.objects}, currentIndex ${currentIndex}, canvas.objects[currentIndex] ${canvas.objects[currentIndex]}`)
    currentObject.move(dx, dy)
    // console.log(dx, dy)
    canvas.rePaint()
    startY = mouseY
    startX = mouseX
  }
}

function deleteSelected (event: KeyboardEvent): void {
  console.log('lol')
  if (event.key === 'Backspace') {
    console.log('lol1')
    canvas.deleteSelected()
  }
}

canvas.canvas.addEventListener('mousedown', createFigure)
canvas.canvas.addEventListener('mousemove', mouseMove)
canvas.canvas.addEventListener('mousedown', findColliding)
canvas.canvas.addEventListener('mouseout', mouseOut)
canvas.canvas.addEventListener('mouseup', mouseOut)
canvas.canvas.addEventListener('mousedown', selectFigure)
canvas.canvas.addEventListener('keydown', deleteSelected)
window.addEventListener('keydown', deleteSelected)
window.addEventListener('keyup', cancelChange)
