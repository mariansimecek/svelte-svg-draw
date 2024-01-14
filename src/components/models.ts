export type ShapeType = 'pencil' | 'rectangle'
export type Tool = 'erase' | 'select' | ShapeType
export type Point = { x: number; y: number }

interface ShapeBase {
    type: ShapeType
    color: string
}

export type Shape = RectangleShape | PencilShape

export interface RectangleShape extends ShapeBase {
    type: 'rectangle'
    start: Point
    width: number
    height: number
}
export interface PencilShape extends ShapeBase {
    type: 'pencil'
    start: Point
    points: Point[]
}
