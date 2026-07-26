import {
  Fragment,
  jsxDEV as reactJsxDEV,
} from 'react/jsx-dev-runtime'
import { translateJsxProps } from './runtime'

export { Fragment }

export function jsxDEV(type, props, key, isStaticChildren, source, self) {
  return reactJsxDEV(
    type,
    translateJsxProps(props),
    key,
    isStaticChildren,
    source,
    self,
  )
}
