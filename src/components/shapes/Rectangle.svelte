<script lang="ts">
    import type { MouseEventHandler } from 'svelte/elements'
    import type { Rect, Shape } from '../models'

    const { shape, dragMeStart } = $props<{
        shape: Rect
        dragMeStart?: MouseEventHandler<SVGRectElement>
    }>()



</script>

<rect
    class="hover:cursor-move"
    stroke-width="3"
    stroke={shape.color}
    fill="none"
    x={shape.start.x}
    y={shape.start.y}
    width={shape.width}
    height={shape.height}
    onmousedown={dragMeStart}
/>
