import { useMemo } from 'react'
import type { Prompt, FilterOptions } from '../types'

export const usePromptFilter = (prompts: Prompt[], options: FilterOptions) => {
  const filteredAndSortedPrompts = useMemo(() => {
    let result = [...prompts]

    // Apply search filter
    if (options.searchQuery) {
      const query = options.searchQuery.toLowerCase()
      result = result.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query)
      )
    }

    // Apply tag filter
    if (options.selectedTags.length > 0) {
      result = result.filter(prompt =>
        options.selectedTags.every(tag => prompt.tags.includes(tag))
      )
    }

    // Apply sorting
    if (options.sortBy) {
      result.sort((a, b) => {
        let valueA: string | number, valueB: string | number

        switch (options.sortBy) {
          case 'title':
            valueA = a.title.toLowerCase()
            valueB = b.title.toLowerCase()
            break
          case 'createdAt':
            valueA = a.createdAt.getTime()
            valueB = b.createdAt.getTime()
            break
          case 'tags':
            valueA = a.tags.length
            valueB = b.tags.length
            break
          default:
            return 0
        }

        if (valueA < valueB) return options.sortOrder === 'asc' ? -1 : 1
        if (valueA > valueB) return options.sortOrder === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [prompts, options.searchQuery, options.selectedTags, options.sortBy, options.sortOrder])

  const availableTags = useMemo(() => {
    const allTags = prompts.flatMap(p => p.tags)
    return [...new Set(allTags)].sort()
  }, [prompts])

  return {
    filteredPrompts: filteredAndSortedPrompts,
    availableTags
  }
}