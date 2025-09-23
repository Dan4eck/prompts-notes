import { useMemo } from 'react'
import PromptCard from './PromptCard'
import './PromptList.css'

import type { PromptListProps } from '../types'

function PromptList({
  prompts,
  searchQuery,
  selectedTags,
  onEdit,
  onDelete,
  onCopy,
  onCreateNew
}: PromptListProps) {
const filteredPrompts = useMemo(() => {
  return prompts.filter(prompt => {
    const matchesSearch = !searchQuery ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => prompt.tags.includes(tag))

    return matchesSearch && matchesTags
  })
}, [prompts, searchQuery, selectedTags])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Prompts & Notes</h1>
            <button
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              New Prompt
            </button>
          </div>

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
                    onClick={onCreateNew}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Create First Prompt
                  </button>
                )}
              </div>
            ) : (
              filteredPrompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onCopy={onCopy}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptList