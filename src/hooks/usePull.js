import { useState, useCallback } from 'react'
import { useApi } from './useApi.js'

export function usePull({ onSuccess, onError } = {}) {
  const { apiFetch } = useApi()
  const [pulling, setPulling] = useState(false)

  const pull = useCallback(async (tier) => {
    if (!tier) throw new Error('tier required')
    setPulling(true)
    try {
      const result = await apiFetch('/api/pull', { method: 'POST', body: { tier } })
      if (onSuccess) await onSuccess(result)
      return result
    } catch (err) {
      if (onError) onError(err)
      throw err
    } finally {
      setPulling(false)
    }
  }, [apiFetch, onSuccess, onError])

  return { pull, pulling }
}
