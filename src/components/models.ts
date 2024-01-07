export type Tool = 'pencil' | 'rectangle'
export type Point = { x: number; y: number }

export type Shape = {
    type: Tool
    color: string
    points: Point[]
}
