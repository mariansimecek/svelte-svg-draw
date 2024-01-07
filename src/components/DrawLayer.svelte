<script lang="ts">
    import type { Tool, Point, Shape } from './models'
    import { colors, type Color } from './colors'
    import { onMount } from 'svelte'
    import Toolbar from './Toolbar.svelte'
    import ColorSelector from './ColorSelector.svelte'

    $effect(() => {
        // console.log('press', press)
        // console.log({ shapes })
    })

    $effect(() => {
        console.log({ shapes, selectedColor })
    })
    const width = 600
    const height = 400
    let ctx: CanvasRenderingContext2D

    let selectedTool = $state<Tool>('pencil')
    let selectedColor = $state<string>(colors.black.value)
    let press = $state<boolean>(false)
    let start = $state<Point>({ x: 0, y: 0 })
    let end = $state<Point>({ x: 0, y: 0 })
    const shapes = $state<Shape[]>([])
    let currentShape = $state<Shape | null>(null)

    onMount(() => {
        const draw_canvas = document.getElementById(
            'draw_canvas'
        ) as HTMLCanvasElement
        ctx = draw_canvas.getContext('2d')!
        if (!ctx) throw new Error('ctx is null')
        console.log(ctx)
    })

    function handleStart(e: MouseEvent) {
        console.debug('handleStart')
        press = true
        start = { x: e.offsetX, y: e.offsetY }
    }
    function handleMove(e: MouseEvent) {
        console.debug('handleMove')

        if (!press) return
        drawShapes()

        switch (selectedTool) {
            case 'pencil':
                drawPencil(e)
                break
            case 'rectangle':
                drawRectangle(e)
                break
        }
    }
    function handleEnd(e: MouseEvent) {
        press = false
        end = { x: e.offsetX, y: e.offsetY }
        console.debug('handleEnd')
        console.log({ ctx })

        saveShape()
        drawShapes()
    }

    function drawRectangle(e: MouseEvent) {
        currentShape = {
            type: 'rectangle',
            color: selectedColor,
            points: [start, { x: e.offsetX, y: e.offsetY }],
        }
    }

    function drawPencil(e: MouseEvent) {
        const items = currentShape?.points ?? []
        const point = { x: e.offsetX, y: e.offsetY }

        currentShape = {
            type: 'pencil',
            //TODO: smooth the line
            color: selectedColor,
            points: [...items, point],
        }
    }

    function saveShape() {
        if (!currentShape) {
            console.warn('currentShape is null')
            return
        }
        shapes.push(currentShape)
        currentShape = null
    }

    function drawShape(shape: Shape) {
        ctx.strokeStyle = shape.color
        // console.log('drawShape', shape)
        switch (shape.type) {
            case 'rectangle':
                const start = shape.points[0]
                const end = shape.points[1]
                ctx.beginPath()
                ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y)
                ctx.stroke()
                break

            case 'pencil':
                const points = shape.points
                for (let i = 1; i < points.length; i++) {
                    const { x, y } = points[i]
                    const { x: x1, y: y1 } = points[i - 1]
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(x1, y1)
                    ctx.closePath()
                    ctx.stroke()
                }
                break
        }
    }

    function drawShapes() {
        // console.log('drawing shapes)')
        ctx.clearRect(0, 0, 600, 400)

        shapes.forEach((shape) => {
            drawShape(shape)
        })

        if (currentShape && press) {
            drawShape(currentShape)
        }
    }
    function reset() {
        shapes.splice(0, shapes.length)
        drawShapes()
    }
</script>

<div class="p-10">
    <div class="flex justify-between">
        <Toolbar bind:selectedTool />
        <ColorSelector bind:selectedColor />
        <div class="flex flex-col text-sm">
            <span>start x: {start.x} y: {start.y}</span>
            <span>end x: {end.x} y: {end.y}</span>
        </div>
    </div>
    <canvas
        {width}
        {height}
        id="draw_canvas"
        class={`bg-gray-100  border-[1px] ${
            press ? 'border-green-400' : 'border-black'
        }`}
        onmousedown={handleStart}
        onmousemove={handleMove}
        onmouseup={handleEnd}
        onmouseleave={handleEnd}
    ></canvas>
    <button class="bg-red-500 p-2" onclick={reset}>Clear</button>
    <div class="grid grid-cols-2">
        <div>
            <b>Current:</b>
            {JSON.stringify(currentShape)}
        </div>
        <div>
            <b>Shapes:</b>
            {JSON.stringify(shapes)}
        </div>
    </div>
</div>
