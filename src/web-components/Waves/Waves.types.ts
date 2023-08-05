export type WavesComponentOptions = {
  heightFrom: number
  heightTo: number
  speed: number
  complexity: number
  amplitude: number
  synchronicity: number
  waves: WaveOptions[]
}

export type WaveOptions = {
  stroke?: StrokeOptions
  fill?: FillOptions
  linearGradient?: LinearGradientOptions
  shadow?: ShadowOptions
}

export type StrokeOptions = {
  color?: string
  width?: number
  opacity?: number
  dashArray?: string
  dashOffset?: string
  linecap?: 'butt' | 'round' | 'square'
}

export type FillOptions = {
  color?: string
  opacity?: number
}

export type LinearGradientOptions = {
  direction: 'toTop' | 'toRight' | 'toBottom' | 'toLeft'
  colors: {
    color: string
    offset: string
    opacity?: number
  }[]
}

export type ShadowOptions = {
  dx?: number
  dy?: number
  stdDeviation?: number
  floodColor?: string
  floodOpacity?: number
}
