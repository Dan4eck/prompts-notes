import { useState, useEffect, useCallback } from 'react'
import type { Prompt } from '../types'

export const usePrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadPrompts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      if (chrome?.storage?.local) {
        chrome.storage.local.get(['prompts'], (result) => {
          if (chrome.runtime.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }

          if (result.prompts) {
            const loadedPrompts = result.prompts.map((p: Prompt) => ({
              ...p,
              createdAt: new Date(p.createdAt)
            }))
            setPrompts(loadedPrompts)
          }
          setLoading(false)
        })
      } else {
        setError('Chrome storage not available')
        setLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts')
      setLoading(false)
    }
  }, [])

  const savePrompts = useCallback(async (updatedPrompts: Prompt[]) => {
    try {
      setError(null)

      if (chrome?.storage?.local) {
        chrome.storage.local.set({ prompts: updatedPrompts }, () => {
          if (chrome.runtime.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
        })
      }

      setPrompts(updatedPrompts)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompts')
      throw err
    }
  }, [])

  const createPrompt = useCallback((promptData: Omit<Prompt, 'id' | 'createdAt'>) => {
    const newPrompt: Prompt = {
      ...promptData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    return savePrompts([...prompts, newPrompt])
  }, [prompts, savePrompts])

  const updatePrompt = useCallback((id: string, updates: Partial<Prompt>) => {
    const updatedPrompts = prompts.map(prompt =>
      prompt.id === id ? { ...prompt, ...updates } : prompt
    )
    return savePrompts(updatedPrompts)
  }, [prompts, savePrompts])

  const deletePrompt = useCallback((id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id)
    return savePrompts(updatedPrompts)
  }, [prompts, savePrompts])

  useEffect(() => {
    loadPrompts()
  }, [loadPrompts])

  return {
    prompts,
    loading,
    error,
    createPrompt,
    updatePrompt,
    deletePrompt,
    refreshPrompts: loadPrompts
  }
}