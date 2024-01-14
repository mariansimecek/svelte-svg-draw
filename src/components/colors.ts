export const colors = {
    red: { name: 'Red', value: '#f00' },
    green: { name: 'Green', value: '#0f0' },
    blue: { name: 'Blue', value: '#00f' },
    black: { name: 'Black', value: 'black' },
} satisfies Record<string, { name: string; value: string }>

export type Color = typeof colors
