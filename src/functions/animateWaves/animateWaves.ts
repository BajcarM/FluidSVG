import { createNoise3D } from 'simplex-noise'
import { AnimateWavesOptions } from '../types'
import {
  createStaticWaveShape,
  getElements,
  updateWaveShape,
} from './waveFunctions'

/**
 * @param svg SVG element or selector
 * @param options Options for the wave animation
 * @returns Function to stop and clean up the animation
 */
export function animateWaves(
  svg: SVGSVGElement | string,
  {
    position = 'bottom',
    speed = 2,
    lowestWaveHeight = 2,
    highestWaveHeight = 8,
    smoothness = 10, // Number of points in the wave
    amplitude = 1, // Movement radius
    complexity = 2, // Noise scaling
    differenceBetweenWaves = 3, // Noise offset
  }: AnimateWavesOptions,
) {
  // Format options for better user experience
  const speedFormatted = speed / 10000
  const lowestWaveHeightFormatted = lowestWaveHeight / 10
  const highestWaveHeightFormatted = highestWaveHeight / 10
  const amplitudeFormatted = amplitude / 10
  const differenceBetweenWavesFormatted = differenceBetweenWaves / 10

  const { svgElement, pathElements } = getElements(svg)

  if (!svgElement || !pathElements) return

  const heightDifference =
    highestWaveHeightFormatted - lowestWaveHeightFormatted

  const heights = pathElements.map((_, index) => {
    if (pathElements.length === 1) {
      return lowestWaveHeightFormatted
    }

    const height =
      highestWaveHeightFormatted -
      heightDifference * (index / (pathElements.length - 1))

    return height
  })

  const noise3DFunction = createNoise3D()
  let noiseTimeline = 0

  const waveShapes = heights.map((height, index) =>
    createStaticWaveShape(
      position,
      height,
      smoothness,
      amplitudeFormatted,
      complexity,
      differenceBetweenWavesFormatted * index,
      noiseTimeline,
      noise3DFunction,
    ),
  )

  let animationFrameId: number | null = null
  let lastTimestamp: number

  function animate(timestamp: DOMHighResTimeStamp) {
    if (!pathElements) return

    if (!lastTimestamp) {
      lastTimestamp = timestamp - 17
    }

    const timeElapsed = timestamp - lastTimestamp
    const timeOptimized = timeElapsed < 17 ? timeElapsed : 17

    noiseTimeline += timeOptimized * speedFormatted

    waveShapes.forEach((waveShape, index) => {
      const updatedWaveShape = updateWaveShape(
        position,
        waveShape,
        amplitudeFormatted,
        complexity,
        noiseTimeline,
        noise3DFunction,
      )

      pathElements[index].setAttribute('d', updatedWaveShape.path)
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  // Start animation and pause when not in view for better performance
  const observer = new IntersectionObserver(([firstEntry]) =>
    firstEntry.isIntersecting ? play() : pause(),
  )

  observer.observe(svgElement)

  function play() {
    if (animationFrameId) return

    animationFrameId = requestAnimationFrame(animate)
  }

  function pause() {
    if (!animationFrameId) return

    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  /**
   * Stop animation and remove observer when unmounting component.
   */
  function destroy() {
    observer.disconnect()

    if (animationFrameId) cancelAnimationFrame(animationFrameId)
  }

  return { destroy }
}
