import { useState, useCallback } from 'react'

const useForceUpdate = () => {
  const [state, updateState] = useState({})
  const forceUpdate = useCallback(() => updateState({}), [])
  return [state, forceUpdate] as const
}

export default useForceUpdate
