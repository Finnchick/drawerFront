import { type Figures } from '../helperTypes'

export class Canvas {
  public id: number
  public name: string
  public objects: Figures [] = [] // add type
  public bgColor: string
  public privacy: boolean
  // private _isDragging: boolean = false // Q: maybe should move to object instance?
  public currentIndex: number // TODO should remove
  public canvas: HTMLCanvasElement // make private and addListeners in the constructor
  private context: CanvasRenderingContext2D

  constructor () {
    this.initCanvas()
    this.initObjects()
  }

  initCanvas (): void {
    this.canvas = document.querySelector('canvas')
    if (this.canvas as boolean) { // should I typecas it to boolean?
      this.context = this.canvas.getContext('2d')
    }
    this.canvas.height = window.innerHeight
    this.canvas.width = window.innerWidth
  }

  initObjects (): void {
    this.objects.forEach(object => { object.draw(this.context) })
  }

  clear (): void {
    this.objects = []
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clearVisual (): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  rePaint (): void {
    this.clearVisual()
    this.initObjects()
  }

  findColliding (px, py): Figures {
    for (const object of this.objects) {
      if (object.isColliding(px, py)) {
        // console.log(`we are in the shape object id is ${object.id}`)
        object.liftUp() // TODO create method in figure that lifts up, and make call in canvas
        return object
      }
    }
  }

  addObject (object): void {
    this.objects.push(object)
    console.log(this.objects)
    object.draw(this.context)
  }

  cancelChange (): void {
    this.objects.pop()
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.initObjects()
  }

  deleteSelected (): void {
    this.objects = this.objects.filter(object => {
      console.log(object)
      return !object.isSelected
    })
    this.rePaint()
  }

  // get isDragging (): boolean {
  //   return this._isDragging
  // }
  //
  // set isDragging (value: boolean) {
  //   this._isDragging = value
  // }
}
