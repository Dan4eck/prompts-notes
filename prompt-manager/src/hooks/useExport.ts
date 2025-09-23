import { useCallback } from 'react'
import type { Prompt } from '../types'

export const useExport = () => {
  const exportToJson = useCallback((prompts: Prompt[]) => {
    try {
      const dataStr = JSON.stringify(prompts, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prompts-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export JSON:', error)
      throw new Error('Failed to export prompts as JSON')
    }
  }, [])

  const exportToCsv = useCallback((prompts: Prompt[]) => {
    try {
      const headers = ['Title', 'Content', 'Tags', 'Created']
      const rows = prompts.map(p => [
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.content.replace(/"/g, '""')}"`,
        `"${p.tags.join(', ')}"`,
        `"${p.createdAt.toISOString()}"`
      ])

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `prompts-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export CSV:', error)
      throw new Error('Failed to export prompts as CSV')
    }
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      throw new Error('Failed to copy to clipboard')
    }
  }, [])

  return {
    exportToJson,
    exportToCsv,
    copyToClipboard
  }
}