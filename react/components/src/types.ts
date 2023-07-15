import { AnimateWavesOptions } from '@fluid-svg/functions'
import { ComponentPropsWithRef } from 'react'

export type FluidWavesOptions = Partial<AnimateWavesOptions>

export type FluidWavesProps = Omit<
  ComponentPropsWithRef<'svg'>,
  'viewBox' | 'preserveAspectRatio'
> & {
  options?: FluidWavesOptions
}
