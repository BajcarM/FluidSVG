import { WavesComponentOptions } from './Waves.types'

export const defaultOptions: WavesComponentOptions = {
  background: 'transparent',
  speed: 2,
  distributionFrom: 2,
  distributionTo: 8,
  amplitude: 1, // Movement radius
  complexity: 2, // Noise scaling
  synchronicity: 3, // Noise offset
  waves: [{}, {}],
}
