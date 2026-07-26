import {
  Fragment,
  jsx as reactJsx,
  jsxs as reactJsxs,
} from 'react/jsx-runtime'
import { translateJsxProps } from './runtime'

export { Fragment }

export function jsx(type, props, key) {
  return reactJsx(type, translateJsxProps(props), key)
}

export function jsxs(type, props, key) {
  return reactJsxs(type, translateJsxProps(props), key)
}
