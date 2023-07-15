'use client'

import { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import { animateWaves } from '@fluid-svg/functions'
import { FluidWavesProps } from './types'

export const FluidWaves = forwardRef<SVGSVGElement | null, FluidWavesProps>(
  ({ children, options, ...props }, ref) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const [svgMounted, setSvgMounted] = useState(false)

    const createAnimation = useCallback(() => {
      if (svgRef.current) {
        return animateWaves(svgRef.current, {
          ...options,
        })
      } else {
        return undefined
      }
    }, [options, svgRef, svgMounted])

    useEffect(() => {
      const animaiton = createAnimation()

      return animaiton?.destroy
    }, [createAnimation])

    function handleRef(element: SVGSVGElement | null) {
      svgRef.current = element
      setSvgMounted(element !== null)

      if (!ref) return

      if (typeof ref === 'function') {
        ref(element)
      } else {
        ref.current = element
      }
    }

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        {...props}
        ref={handleRef}
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
      >
        {children}
      </svg>
    )
  },
)
