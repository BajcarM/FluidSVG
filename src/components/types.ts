import { ComponentPropsWithRef } from 'react'
import { AnimateWavesOptions } from '../functions'

export type FluidWavesOptions = Partial<AnimateWavesOptions>

export type FluidWavesProps = Omit<
  ComponentPropsWithRef<'svg'>,
  'viewBox' | 'preserveAspectRatio'
> & {
  options?: FluidWavesOptions
}
