<script lang="ts">
    import type { Tool } from './models'

    let { selectedTool } = $props()

    const tools: { type: Tool; name: string }[] = [
        { type: 'pencil', name: 'Pencil' },
        { type: 'rectangle', name: 'Rectangle' },
        { type: 'select', name: 'Select' },
    ]
</script>

<div class="flex items-center p-2 gap-2">
    {#each tools as tool}
        <button
            class="p-4 bg-gray-200 rounded-md"
            class:font-bold={selectedTool === tool.type}
            on:click={() => (selectedTool = tool.type)}
        >
            {tool.name}
        </button>
    {/each}
</div>
