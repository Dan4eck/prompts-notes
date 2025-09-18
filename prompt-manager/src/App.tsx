import { useState, useEffect } from 'react'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  category?: string
}

function App() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'edit' | 'preview'>('list')
  const [editingPrompt, setEditingPrompt] = useState<Partial<Prompt>>({})
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Load prompts from Chrome storage
  useEffect(() => {
    const loadPrompts = () => {
      if (chrome?.storage?.local) {
        chrome.storage.local.get(['prompts'], (result) => {
          if (result.prompts) {
            const loadedPrompts = result.prompts.map((p: any) => ({
              ...p,
              createdAt: new Date(p.createdAt)
            }))
            setPrompts(loadedPrompts)

            // Extract all unique tags
            const allTags = loadedPrompts.flatMap(p => p.tags)
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

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = !searchQuery ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => prompt.tags.includes(tag))

    return matchesSearch && matchesTags
  })

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
      createdAt: editingPrompt.createdAt ? new Date(editingPrompt.createdAt) : new Date(),
      category: editingPrompt.category
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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingPrompt.id ? 'Edit Prompt' : 'Create New Prompt'}
              </h2>
              <button
                onClick={() => {
                  setViewMode('list')
                  setEditingPrompt({})
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPrompt.title || ''}
                  onChange={(e) => setEditingPrompt(prev => ({
                    ...prev,
                    title: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter prompt title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={editingPrompt.content || ''}
                  onChange={(e) => setEditingPrompt(prev => ({
                    ...prev,
                    content: e.target.value
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 font-mono text-sm"
                  placeholder="Enter your prompt content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingPrompt.tags?.join(', ') || ''}
                  onChange={(e) => setEditingPrompt(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tag1, tag2, tag3..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewMode('list')
                    setEditingPrompt({})
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrompt}
                  disabled={!editingPrompt.title}
                  className={`px-4 py-2 rounded-md text-white ${
                    editingPrompt.title
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-400 cursor-not-allowed'
                  }`}
                >
                  Save Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Prompts & Notes</h1>
            <div className="flex space-x-2">
              <button
                onClick={exportToJson}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export JSON
              </button>
              <button
                onClick={exportToCsv}
                className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Export CSV
              </button>
              <button
                onClick={handleCreatePrompt}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                New Prompt
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {availableTags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by tags:</h3>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  {searchQuery || selectedTags.length > 0
                    ? 'No prompts match your search criteria.'
                    : 'No prompts yet. Create your first prompt to get started!'
                  }
                </p>
                {!searchQuery && selectedTags.length === 0 && (
                  <button
                    onClick={handleCreatePrompt}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create First Prompt
                  </button>
                )}
              </div>
            ) : (
              filteredPrompts.map(prompt => (
                <div key={prompt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{prompt.title}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => copyToClipboard(prompt.content)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                        title="Copy to clipboard"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleEditPrompt(prompt)}
                        className="text-gray-500 hover:text-gray-700 text-sm"
                        title="Edit prompt"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(prompt.id)}
                        className="text-gray-500 hover:text-red-700 text-sm"
                        title="Delete prompt"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {prompt.content.substring(0, 200)}
                    {prompt.content.length > 200 && '...'}
                  </p>

                  {prompt.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-gray-400 mt-2">
                    Created: {prompt.createdAt.toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App