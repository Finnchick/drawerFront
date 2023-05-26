import { DrawingObject } from './DrawingObject'
import { type Point } from '../helperTypes'
import { calculateDistance } from '../helpers'

export class Line extends DrawingObject {
  private point: Point
  public color: string
  private _isDragging: boolean = false
  private _isSelected: boolean = false

  constructor () {
    super()
    this.id = Date.now()
    this.color = 'black'
  }

  create (startingPoint: Point, endingPoint: Point): void { // Q: should it return created object? I consider no
    this.position = startingPoint
    this.point = endingPoint
  }

  draw (context: CanvasRenderingContext2D): void {
    context.beginPath()
    const { x: xStart, y: yStart } = this.position
    context.moveTo(xStart, yStart)
    console.log('tes')
    const { x: xEnd, y: yEnd } = this.point
    context.lineTo(xEnd, yEnd)
    context.strokeStyle = this.getColor()
    context.stroke()
  }

  getColor (): string {
    return this._isDragging || this._isSelected ? 'Red' : 'Black'
  }

  isColliding (px, py): boolean {
    const d1 = calculateDistance(px, py, this.position.x, this.position.y)
    const d2 = calculateDistance(px, py, this.point.x, this.point.y)

    console.log(px, py, this.position.x, this.position.y)
    // get the length of the line
    const lineLen = calculateDistance(this.position.x, this.position.y, this.point.x, this.point.y)
    console.log(d1, d2, lineLen)
    // since floats are so minutely accurate, add
    // a little buffer zone that will give collision
    const buffer = 0.1 // higher # = less accurate

    // if the two distances are equal to the line's
    // length, the point is on the line!
    // note we use the buffer here to give a range,
    // rather than one #
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer
  }

  move (dx: number, dy: number): void {
    this.position.y += dy
    this.position.x += dx
    this.point.x += dx
    this.point.y += dy
  }

  endMovement (): void {
    this._isDragging = false
    this.color = 'Black'
  }

  remove () {
  }

  get isDragging (): boolean {
    return this._isDragging
  }

  get isSelected (): boolean {
    return this._isSelected
  }

  select (): void {
    this._isSelected = !this._isSelected
  }

  liftUp (): void {
    this._isDragging = true
  }

  layDown (): void {
    this._isDragging = false
  }
}
