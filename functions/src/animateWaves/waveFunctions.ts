import { NoiseFunction3D } from 'simplex-noise'
import { Vector2D, WaveShape } from '../types'
import { createCubicSpline } from '../utils/createCubicSpline'

export function generatePointsOnLine(
  start: Vector2D,
  end: Vector2D,
  numPoints: number,
  additionalPointsForSpline = true,
): Vector2D[] {
  const pointsCoords: Vector2D[] = []
  const xIncrement = (end[0] - start[0]) / numPoints
  const yIncrement = (end[1] - start[1]) / numPoints

  if (additionalPointsForSpline) {
    pointsCoords.push([start[0] - xIncrement, start[1] - yIncrement])
  }

  for (let i = 0; i < numPoints; i++) {
    const x = start[0] + xIncrement * i
    const y = start[1] + yIncrement * i
    pointsCoords.push([x, y])
  }

  if (additionalPointsForSpline) {
    pointsCoords.push([end[0], end[1]])
    pointsCoords.push([end[0] + xIncrement, end[1] + yIncrement])
    pointsCoords.push([end[0] + xIncrement * 2, end[1] + yIncrement * 2])
  }

  return pointsCoords
}

export function createStaticWaveShape(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveHeight: number,
  numPoints: number,
  movementRadius: number,
  noiseScaling: number,
  noiseOffset: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  const { start, end, corner1, corner2 } = getCorners(position, waveHeight)

  const pointsOrigins = generatePointsOnLine(start, end, numPoints)
  const pointsNoiseCoords = getNoiseCoords(position, pointsOrigins, noiseOffset)

  const pointsPositions = pointsOrigins.map((point, index) => {
    // Waves can have different offset in svg from noise plane
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * noiseScaling,
      noiseCoords[1] * noiseScaling,
      noiseTimeline,
    )

    const pointPosition = getPointPosition(
      position,
      point,
      movementRadius,
      noiseValue,
    )

    return pointPosition
  })

  const wavePath = createCubicSpline(pointsPositions, 2, false)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    pointsOrigins,
    pointsPositions,
    pointsNoiseCoords,
    path,
    corners: [corner1, corner2],
  }
}

/**
 * Returns the coordinates of the other 2 corners outside svg so path can have fill
 */
export function getCorners(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveHeight: number,
) {
  let start: Vector2D, end: Vector2D, corner1: Vector2D, corner2: Vector2D

  switch (position) {
    case 'top':
      start = [-0.2, waveHeight]
      end = [1.2, waveHeight]
      corner1 = [1.2, -0.2]
      corner2 = [-0.2, -0.2]
      break
    case 'right':
      start = [1 - waveHeight, -0.2]
      end = [1 - waveHeight, 1.2]
      corner1 = [1.2, 1.2]
      corner2 = [1.2, -0.2]

      break
    case 'bottom':
      start = [-0.2, 1 - waveHeight]
      end = [1.2, 1 - waveHeight]
      corner1 = [1.2, 1.2]
      corner2 = [-0.2, 1.2]
      break
    case 'left':
      start = [waveHeight, -0.2]
      end = [waveHeight, 1.2]
      corner1 = [-0.2, 1.2]
      corner2 = [-0.2, -0.2]
      break
  }

  return { start, end, corner1, corner2 }
}

/**
 * Returns the noise coordinates for each point
 */
export function getNoiseCoords(
  position: 'top' | 'right' | 'bottom' | 'left',
  pointsOrigin: Vector2D[],
  noiseOffset: number,
) {
  const noiseCoords = pointsOrigin.map((point) => {
    switch (position) {
      case 'top':
        return [point[0], point[1] * noiseOffset]

      case 'right':
        return [point[0] * noiseOffset, point[1]]

      case 'bottom':
        return [point[0], point[1] * noiseOffset]

      case 'left':
        return [point[0] * noiseOffset, point[1]]
    }
  })

  return noiseCoords as Vector2D[]
}

/**
 * Returns the new position of a point based on the noise value
 */
export function getPointPosition(
  position: 'top' | 'right' | 'bottom' | 'left',
  point: Vector2D,
  movementRadius: number,
  noiseValue: number,
) {
  let pointPosition: Vector2D

  switch (position) {
    case 'top':
      pointPosition = [point[0], point[1] + (noiseValue * movementRadius) / 2]
      break
    case 'right':
      pointPosition = [point[0] + (noiseValue * movementRadius) / 2, point[1]]
      break
    case 'bottom':
      pointPosition = [point[0], point[1] + (noiseValue * movementRadius) / 2]
      break
    case 'left':
      pointPosition = [point[0] + (noiseValue * movementRadius) / 2, point[1]]
      break
  }

  return pointPosition
}

/**
 * Updates the wave shape with new noise values
 */
export function updateWaveShape(
  position: 'top' | 'right' | 'bottom' | 'left',
  waveShape: WaveShape,
  movementRadius: number,
  noiseScaling: number,
  noiseTimeline: number,
  noise3DFunction: NoiseFunction3D,
): WaveShape {
  const {
    pointsOrigins,
    pointsNoiseCoords,
    corners: [corner1, corner2],
  } = waveShape

  const pointsPositions = pointsOrigins.map((point, index) => {
    const noiseCoords = pointsNoiseCoords[index]

    const noiseValue = noise3DFunction(
      noiseCoords[0] * noiseScaling,
      noiseCoords[1] * noiseScaling,
      noiseTimeline,
    )

    const pointPosition = getPointPosition(
      position,
      point,
      movementRadius,
      noiseValue,
    )

    return pointPosition
  })

  const wavePath = createCubicSpline(pointsPositions, 2, false)

  // Add the corners to the path
  const path = `${wavePath}
              L ${corner1[0]},${corner1[1]}
              L ${corner2[0]},${corner2[1]}
              Z`

  return {
    ...waveShape,
    pointsPositions,
    path,
  }
}

/**
 * Returns the SVG element and all the PATH elements inside it
 * @param svg SVG element or selector
 * @returns SVG element and PATH elements
 */
export function getElements(svg: SVGSVGElement | string) {
  const svgElement = typeof svg === 'string' ? document.querySelector(svg) : svg

  if (!svgElement) {
    console.error('Fluid-Waves: SVG element not found')
    return {
      svgElement: null,
      pathElements: null,
    }
  }

  if (!(svgElement instanceof SVGSVGElement)) {
    console.error('Fluid-Waves: Element is not an SVG element')
    return {
      svgElement: null,
      pathElements: null,
    }
  }

  const pathElements = Array.from(svgElement.querySelectorAll('path'))

  if (pathElements.length === 0) {
    console.error('Fluid-Waves: No PATH elements found')
    return {
      svgElement: svgElement,
      pathElements: null,
    }
  }

  return { svgElement, pathElements }
}
