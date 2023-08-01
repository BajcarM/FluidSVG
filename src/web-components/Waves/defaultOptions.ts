import { WavesComponentOptions } from './Waves.types'

export const defaultOptions: WavesComponentOptions = {
  speed: 2,
  heightFrom: 2,
  heightTo: 8,
  amplitude: 1, // Movement radius
  smoothness: 2, // Noise scaling
  differenceBetweenWaves: 3, // Noise offset
  waves: [{}, {}],
}
