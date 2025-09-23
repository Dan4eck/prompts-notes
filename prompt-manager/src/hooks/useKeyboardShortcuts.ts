import { useEffect, useCallback } from 'react'

export type Shortcut = {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  action: () => void
  description: string
}

export const useKeyboardShortcuts = (shortcuts: Shortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!shortcut.ctrl === event.ctrlKey
      const shiftMatch = !!shortcut.shift === event.shiftKey
      const altMatch = !!shortcut.alt === event.altKey
      const metaMatch = !!shortcut.meta === event.metaKey

      return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
    })

    if (matchingShortcut) {
      event.preventDefault()
      matchingShortcut.action()
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}

export const useShortcutHelp = (shortcuts: Shortcut[]) => {
  const getShortcutString = (shortcut: Shortcut): string => {
    const parts = []

    if (shortcut.ctrl) parts.push('Ctrl')
    if (shortcut.shift) parts.push('Shift')
    if (shortcut.alt) parts.push('Alt')
    if (shortcut.meta) parts.push('Cmd')

    parts.push(shortcut.key.toUpperCase())

    return parts.join(' + ')
  }

  return {
    shortcuts: shortcuts.map(s => ({
      ...s,
      keyString: getShortcutString(s)
    }))
  }
}