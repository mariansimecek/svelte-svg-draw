<script lang="ts">
    import type { MouseEventHandler } from 'svelte/elements'
    import type { PencilShape, Shape } from '../models'

    const { shape, dragMeStart } = $props<{
        shape: PencilShape
        dragMeStart?: MouseEventHandler<SVGPathElement>
    }>()

    const points = $derived(shape.points.map((p) => `${p.x},${p.y}`).join(' '))
</script>

<!-- <polyline -->
<!--     {points} -->
<!--     x={shape.start.x} -->
<!--     y={shape.start.y} -->
<!--     stroke-width="3" -->
<!--     stroke={shape.color} -->
<!--     fill="none" -->
<!-- /> -->

<path
    fill="none"
    transform={`translate(${shape.start.x} ${shape.start.y})`}
    d={'M' + points}
    stroke="black"
    stroke-width="3"
    stroke-linecap="round"
    class="hover:cursor-move"
    onmousedown={dragMeStart}
/>
