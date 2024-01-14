<script lang="ts">
    import type { Tool, Point, Shape, PencilShape } from './models'
    import { colors } from './colors'
    import Toolbar from './Toolbar.svelte'
    import ColorSelector from './ColorSelector.svelte'
    import Rectangle from './shapes/Rectangle.svelte'
    import Pencil from './shapes/Pencil.svelte'

    let selectedTool = $state<Tool>('select')
    let selectedColor = $state<string>(colors.black.value)
    let press = $state<boolean>(false)
    let shapeDrag = $state<number>(-1)

    let start = $state<Point>({ x: 0, y: 0 })
    let end = $state<Point>({ x: 0, y: 0 })
    const shapes = $state<Shape[]>([])
    let currentShape = $state<Shape | null>(null)

    function handleStart(e: MouseEvent) {
        console.debug('handleStart')
        press = true
        start = { x: e.offsetX, y: e.offsetY }
    }

    function handleMove(e: MouseEvent) {
        console.debug('handleMove')
        if (!press) return

        if (shapeDrag !== -1) {
            const shape = shapes[shapeDrag]
            shape.start.x += e.movementX
            shape.start.y += e.movementY
            return
        }

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
        shapeDrag = -1
        end = { x: e.offsetX, y: e.offsetY }
        console.debug('handleEnd')

        saveShape()
    }

    function drawRectangle(e: MouseEvent) {
        const width = e.offsetX - start.x
        const height = e.offsetY - start.y
        const _start = {
            x: width > 0 ? start.x : e.offsetX,
            y: height > 0 ? start.y : e.offsetY,
        }

        currentShape = {
            type: 'rectangle',
            start: _start,
            width: Math.abs(width),
            height: Math.abs(height),
            color: selectedColor,
        }
    }

    function drawPencil(e: MouseEvent) {
        const items = (currentShape as PencilShape)?.points ?? []
        const point = { x: e.offsetX, y: e.offsetY }

        currentShape = {
            type: 'pencil',
            //TODO: smooth the line
            color: selectedColor,
            start: { x: 0, y: 0 },
            points: [...items, point],
        } satisfies PencilShape
    }

    function saveShape() {
        if (!currentShape) {
            console.warn('currentShape is null')
            return
        }
        shapes.push(currentShape)
        currentShape = null
    }

    function reset() {
        shapes.splice(0, shapes.length)
    }

    function handleShapeDrag(index: number) {
        shapeDrag = index
        console.log('start dragging shape', index)
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
    <div
        id="draw_canvas"
        class={`bg-gray-100 border-[1px] w-[600px] h-[400px] ${
            press ? 'border-green-400' : 'border-black'
        }`}
        onmousedown={handleStart}
        onmousemove={handleMove}
        onmouseup={handleEnd}
        role="application"
        aria-label="Drawing Canvas"
    >
        <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            {#if currentShape?.type === 'rectangle'}
                <Rectangle shape={currentShape} />
            {/if}
            {#if currentShape?.type === 'pencil'}
                <Pencil shape={currentShape} />
            {/if}
            {#each shapes as shape, index}
                {#if shape.type === 'rectangle'}
                    <Rectangle
                        {shape}
                        dragMeStart={() => handleShapeDrag(index)}
                    />
                {/if}
                {#if shape.type === 'pencil'}
                    <Pencil
                        {shape}
                        dragMeStart={() => handleShapeDrag(index)}
                    />
                {/if}
            {/each}
        </svg>
    </div>
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
