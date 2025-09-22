import { useState, useEffect } from 'react'
import PromptList from './components/PromptList'
import PromptEditor from './components/PromptEditor'
import SearchBar from './components/SearchBar'
import TagFilter from './components/TagFilter'
import ExportMenu from './components/ExportMenu'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
}

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list')
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt>>({})
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Load prompts from Chrome storage
  useEffect(() => {
    const loadPrompts = () => {
      if (chrome?.storage?.local) {
        chrome.storage.local.get(['prompts'], (result) => {
          if (result.prompts) {
            const loadedPrompts = result.prompts.map((p: Prompt) => ({
              ...p,
              createdAt: new Date(p.createdAt)
            }))
            setPrompts(loadedPrompts)

            // Extract all unique tags
            const allTags = loadedPrompts.flatMap((p: Prompt) => p.tags) as string[]
            setAvailableTags([...new Set(allTags)])
          }
        })
      }
    }

    loadPrompts()
  }, [])

  // Save prompts to Chrome storage
  const savePrompts = (updatedPrompts: Prompt[]) => {
    setPrompts(updatedPrompts)

    if (chrome?.storage?.local) {
      chrome.storage.local.set({ prompts: updatedPrompts })

      // Update available tags
      const allTags = updatedPrompts.flatMap(p => p.tags)
      setAvailableTags([...new Set(allTags)])
    }
  }

  const handleCreatePrompt = () => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      title: 'New Prompt',
      content: '',
      tags: [],
      createdAt: new Date()
    }

    setEditingPrompt(newPrompt)
    setViewMode('edit')
  }

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt)
    setViewMode('edit')
  }

  const handleSavePrompt = () => {
    if (!editingPrompt.title || !editingPrompt.id) return

    const promptToSave: Prompt = {
      id: editingPrompt.id,
      title: editingPrompt.title,
      content: editingPrompt.content || '',
      tags: editingPrompt.tags || [],
      createdAt: editingPrompt.createdAt ? new Date(editingPrompt.createdAt) : new Date()
    }

    const existingIndex = prompts.findIndex(p => p.id === editingPrompt.id)
    let updatedPrompts: Prompt[]

    if (existingIndex >= 0) {
      updatedPrompts = [...prompts]
      updatedPrompts[existingIndex] = promptToSave
    } else {
      updatedPrompts = [...prompts, promptToSave]
    }

    savePrompts(updatedPrompts)
    setViewMode('list')
    setEditingPrompt({})
  }

  const handleDeletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter(p => p.id !== id)
    savePrompts(updatedPrompts)
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const exportToJson = () => {
    const dataStr = JSON.stringify(prompts, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'prompts.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const exportToCsv = () => {
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
    link.download = 'prompts.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  if (viewMode === 'edit') {
    return (
      <PromptEditor
        editingPrompt={editingPrompt}
        onEditPromptChange={setEditingPrompt}
        onSave={handleSavePrompt}
        onCancel={() => {
          setViewMode('list')
          setEditingPrompt({})
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Prompts & Notes</h1>
            <ExportMenu
              prompts={prompts}
              onExportToJson={exportToJson}
              onExportToCsv={exportToCsv}
            />
          </div>

          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />

          <PromptList
            prompts={prompts}
            searchQuery={searchQuery}
            selectedTags={selectedTags}
            onEdit={handleEditPrompt}
            onDelete={handleDeletePrompt}
            onCopy={copyToClipboard}
            onCreateNew={handleCreatePrompt}
          />
        </div>
      </div>
    </div>
  )
}

export default App