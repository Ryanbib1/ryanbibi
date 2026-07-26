import { createElement as reactCreateElement } from 'react'
import { translateJsxProps } from './runtime'

export * from './jsx-runtime'

export function createElement(type, props, ...children) {
  const nextProps = translateJsxProps({
    ...props,
    children: children.length === 1 ? children[0] : children,
  })
  const { children: translatedChildren, ...rest } = nextProps
  const childList = Array.isArray(translatedChildren)
    ? translatedChildren
    : [translatedChildren]

  return reactCreateElement(type, rest, ...childList)
}
