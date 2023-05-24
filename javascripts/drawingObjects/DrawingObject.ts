import { type Point } from '../helperTypes'

export abstract class DrawingObject {
  public id: number // it makes sense, because we will need the id for canvas;
  public position: Point
  public type: string // TODO make enum for types?
  /*    abstract draw(context: CanvasRenderingContext2D);
    abstract create();
    abstract remove();
    abstract edit(); */
  // create (Point: Point): void {
  // }
  //
  // create (firstPoint: Point, secondPoint: Point): void {
  // }
}
