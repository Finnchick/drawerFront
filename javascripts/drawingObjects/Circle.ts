import { DrawingObject } from './DrawingObject'
import { type Point } from '../helperTypes'

export class Circle extends DrawingObject {
  private readonly points: [{ x: number, y: number }] = []
  private readonly radius: number = 50
  private _isDragging: boolean = false
  public color: string
  private _isSelected: boolean = false

  constructor () {
    super()
    this.id = Date.now()
    this.color = 'black'
  }

  create (startingPoint: Point): void {
    this.position = startingPoint
  }

  draw (context: CanvasRenderingContext2D): void {
    context.beginPath()
    const { x: xStart, y: yStart } = this.position
    context.arc(xStart, yStart, this.radius, 0, 2 * Math.PI)
    context.strokeStyle = this.color
    context.stroke()
  }

  isColliding (px, py): boolean {
    const { x: cx, y: cy } = this.position
    const distX = px - cx
    const distY = py - cy
    const distance = Math.sqrt((distX * distX) + (distY * distY))

    // if the distance is less than the circle's
    // radius the point is inside!
    return distance <= this.radius
  }

  move (dx: number, dy: number): void {
    this.color = 'Red'
    this.position.x += dx
    this.position.y += dy
  }

  endMovement (): void {
    this._isDragging = false
    this.color = 'Black'
  }

  remove () {
  }

  select (): void {
    this.color = this.color === 'Red' ? 'Black' : 'Red'
    this._isSelected = !this._isSelected
  }

  get isDragging (): boolean {
    return this._isDragging
  }

  get isSelected (): boolean {
    return this._isSelected
  }

  liftUp (): void {
    this._isDragging = true
  }

  layDown (): void {
    this._isDragging = false
  }
}
