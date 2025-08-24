import { useCallback, useEffect, useState } from 'react'
import { DIRECTION_KEYS, type Direction } from '../../types/common'


export const useHeroControls = () => {
  const [heldDirections, setHeldDirections] = useState<Direction[]>([])



  const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
    const direction = DIRECTION_KEYS[e.code]
    if (!direction) return

    setHeldDirections((prev) => {
      if (isKeyDown) {
        return prev.includes(direction) ? prev : [direction, ...prev]
      }
      return prev.filter((dir) => dir !== direction)
    })
  }, [])



  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKey(e, true)
    const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKey])



  const getControlsDirection = useCallback(
    (): Direction | null => heldDirections[0] || null,
    [heldDirections]
  )

  return { getControlsDirection }
}