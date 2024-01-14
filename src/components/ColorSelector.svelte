<script lang="ts">
    import { colors, type Color } from './colors'

    let { selectedColor } = $props<{ selectedColor: string }>()
</script>

<div class="flex gap-2">
    {#each Object.entries(colors) as [key, color]}
        <button
            class={`size-8 rounded-md outline outline-2 outline-offset-2 ${
                selectedColor === key ? 'outline-black' : 'outline-transparent'
            }`}
            onclick={() => (selectedColor = key as Color)}
            style:background={color.value}
        ></button>
    {/each}
</div>
