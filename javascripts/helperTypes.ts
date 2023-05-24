import { type Circle } from './drawingObjects/Circle'
import { type Rectangle } from './drawingObjects/Rectangle'
import { type Line } from './drawingObjects/Line'

export interface Point {
  x: number
  y: number
}

export type Figures = Circle | Rectangle | Line // Q: maybe should make it other way? Cause when I will add more figures I need every time to add this object type here
