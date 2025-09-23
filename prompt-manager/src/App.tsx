import { useState, useCallback } from 'react'
import { usePrompts } from './hooks/usePrompts'
import { usePromptFilter } from './hooks/usePromptFilter'
import { useExport } from './hooks/useExport'
import { useKeyboardShortcuts, useShortcutHelp } from './hooks/useKeyboardShortcuts'
import type { ViewMode, FilterOptions, Prompt } from './types'
import PromptList from './components/PromptList'
import PromptEditor from './components/PromptEditor'
import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import ExportMenu from './components/ExportMenu'
import { ErrorBoundary } from './components/ErrorBoundary'
import { LoadingSpinner } from './components/LoadingSpinner'
import { ErrorMessage } from './components/ErrorMessage'
import { KeyboardShortcutsHelp } from './components/KeyboardShortcutsHelp'

function App() {
  const { prompts, loading, error, createPrompt, updatePrompt, deletePrompt, refreshPrompts } = usePrompts()
  const { exportToJson, exportToCsv, copyToClipboard } = useExport()

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false)
  const [filterError, setFilterError] = useState<string | null>(null)

  const filterOptions: FilterOptions = {
    searchQuery,
    selectedTags,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }

  const { filteredPrompts, availableTags } = usePromptFilter(prompts, filterOptions)

  const handleCreatePrompt = useCallback(() => {
    setEditingPrompt({
      title: 'New Prompt',
      content: '',
      tags: []
    })
    setViewMode('edit')
  }, [])

  const handleEditPrompt = useCallback((prompt: Prompt) => {
    setEditingPrompt(prompt)
    setViewMode('edit')
  }, [])

  const handleSavePrompt = useCallback(async () => {
    try {
      if (!editingPrompt.title || !editingPrompt.id) {
        if (!editingPrompt.title) {
          throw new Error('Title is required')
        }
        // Create new prompt
        await createPrompt({
          title: editingPrompt.title,
          content: editingPrompt.content || '',
          tags: editingPrompt.tags || []
        })
      } else {
        // Update existing prompt
        await updatePrompt(editingPrompt.id, {
          title: editingPrompt.title,
          content: editingPrompt.content || '',
          tags: editingPrompt.tags || []
        })
      }

      setViewMode('list')
      setEditingPrompt({})
      setFilterError(null)
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to save prompt')
    }
  }, [editingPrompt, createPrompt, updatePrompt])

  const handleDeletePrompt = useCallback(async (id: string) => {
    try {
      await deletePrompt(id)
      setFilterError(null)
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to delete prompt')
    }
  }, [deletePrompt])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  const handleCopy = useCallback(async (content: string) => {
    try {
      await copyToClipboard(content)
      setFilterError(null)
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to copy to clipboard')
    }
  }, [copyToClipboard])

  const shortcuts = [
    {
      key: 'n',
      ctrl: true,
      action: handleCreatePrompt,
      description: 'Create new prompt'
    },
    {
      key: '/',
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        searchInput?.focus()
      },
      description: 'Focus search'
    },
    {
      key: 'Escape',
      action: () => {
        if (viewMode === 'edit') {
          setViewMode('list')
          setEditingPrompt({})
        } else if (showShortcutsHelp) {
          setShowShortcutsHelp(false)
        }
      },
      description: 'Cancel/Go back'
    },
    {
      key: '?',
      action: () => setShowShortcutsHelp(true),
      description: 'Show keyboard shortcuts'
    }
  ]

  const { shortcuts: shortcutHelp } = useShortcutHelp(shortcuts)
  useKeyboardShortcuts(shortcuts)

  const handleExportToJson = useCallback(() => {
    try {
      exportToJson(prompts)
      setFilterError(null)
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to export JSON')
    }
  }, [prompts, exportToJson])

  const handleExportToCsv = useCallback(() => {
    try {
      exportToCsv(prompts)
      setFilterError(null)
    } catch (err) {
      setFilterError(err instanceof Error ? err.message : 'Failed to export CSV')
    }
  }, [prompts, exportToCsv])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" message="Loading your prompts..." />
      </div>
    )
  }

  if (viewMode === 'edit') {
    return (
      <ErrorBoundary>
        <PromptEditor
          editingPrompt={editingPrompt}
          onEditPromptChange={setEditingPrompt}
          onSave={handleSavePrompt}
          onCancel={() => {
            setViewMode('list')
            setEditingPrompt({})
          }}
        />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Prompts & Notes</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowShortcutsHelp(true)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  title="Keyboard shortcuts"
                >
                  ⌨️
                </button>
                <ExportMenu
                  prompts={prompts}
                  onExportToJson={handleExportToJson}
                  onExportToCsv={handleExportToCsv}
                />
              </div>
            </div>

            {error && (
              <ErrorMessage
                message={error}
                onRetry={refreshPrompts}
                onDismiss={() => setFilterError(null)}
              />
            )}

            {filterError && (
              <ErrorMessage
                message={filterError}
                onDismiss={() => setFilterError(null)}
              />
            )}

            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search prompts..."
            />

            <TagFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />

            <PromptList
              prompts={filteredPrompts}
              searchQuery={searchQuery}
              selectedTags={selectedTags}
              onEdit={handleEditPrompt}
              onDelete={handleDeletePrompt}
              onCopy={handleCopy}
              onCreateNew={handleCreatePrompt}
            />
          </div>
        </div>
      </div>

      {showShortcutsHelp && (
        <KeyboardShortcutsHelp
          shortcuts={shortcutHelp}
          onClose={() => setShowShortcutsHelp(false)}
        />
      )}
    </ErrorBoundary>
  )
}

export default App