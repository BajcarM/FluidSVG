import { createNoise3D } from 'simplex-noise'
import { getRandomWavesOptions } from '../types'
import { createStaticWaveShape } from './waveFunctions'

/**
 * @param numberOfWaves Number of waves
 * @param options Options for the waves
 * @returns Array of d attributes for the wave paths
 */
export function getStaticWaves(
  numberOfWaves: number,
  {
    position = 'bottom',
    lowestWaveHeight = 2,
    highestWaveHeight = 8,
    smoothness = 10, // Number of points in the wave
    amplitude = 1, // Movement radius
    complexity = 2, // Noise scaling
    differenceBetweenWaves = 3, // Noise offset
  }: getRandomWavesOptions,
) {
  if (numberOfWaves < 1) {
    console.error('Number of waves must be greater than 0')

    return []
  }

  // Format options for better user experience
  const lowestWaveHeightFormatted = lowestWaveHeight / 10
  const highestWaveHeightFormatted = highestWaveHeight / 10
  const amplitudeFormatted = amplitude / 10
  const differenceBetweenWavesFormatted = differenceBetweenWaves / 10

  const heightDifference =
    highestWaveHeightFormatted - lowestWaveHeightFormatted

  const heights = Array.from({ length: numberOfWaves }).map((_, index) => {
    if (numberOfWaves === 1) {
      return lowestWaveHeightFormatted
    }

    const height =
      highestWaveHeightFormatted -
      heightDifference * (index / (numberOfWaves - 1))

    return height
  })

  const noise3DFunction = createNoise3D()

  const waveShapes = heights.map((height, index) =>
    createStaticWaveShape(
      position,
      height,
      smoothness,
      amplitudeFormatted,
      complexity,
      differenceBetweenWavesFormatted * index,
      0,
      noise3DFunction,
    ),
  )

  const wavePaths = waveShapes.map(({ path }) => path)

  return wavePaths
}
