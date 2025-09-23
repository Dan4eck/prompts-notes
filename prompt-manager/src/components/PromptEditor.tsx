import { useState, useCallback, useMemo } from 'react'

import './PromptEditor.css'

import type { PromptEditorProps } from '../types'

function PromptEditor({
  editingPrompt,
  onEditPromptChange,
  onSave,
  onCancel
}: PromptEditorProps) {
  const [tagInputValue, setTagInputValue] = useState(() => {
    return Array.isArray(editingPrompt.tags) ? editingPrompt.tags.join(', ') : ''
  })

  const handleTitleChange = useCallback((title: string) => {
    onEditPromptChange({ ...editingPrompt, title })
  }, [editingPrompt, onEditPromptChange])

  const handleContentChange = useCallback((content: string) => {
    onEditPromptChange({ ...editingPrompt, content })
  }, [editingPrompt, onEditPromptChange])

  const handleTagsChange = useCallback((tagsString: string) => {
    setTagInputValue(tagsString) // Always preserve the raw input

    // Only process the tags when it makes sense to do so
    const tags = tagsString.split(/\s*,\s*/)
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, 10)

    onEditPromptChange({ ...editingPrompt, tags })
  }, [editingPrompt, onEditPromptChange])

  const getCurrentTagCount = useMemo(() => {
    if (!Array.isArray(editingPrompt.tags)) return 0
    return editingPrompt.tags.length
  }, [editingPrompt.tags])

  const getRemainingTags = useMemo(() => {
    return Math.max(0, 10 - getCurrentTagCount)
  }, [getCurrentTagCount])


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto h-full px-4">
        <div className="bg-white rounded-lg shadow-md p-8 h-full flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {editingPrompt.id ? 'Edit Prompt' : 'Create New Prompt'}
            </h2>
          </div>

          <div className="flex-1 flex flex-col space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Title
                </label>
                <input
                  type="text"
                  value={editingPrompt.title || ''}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter prompt title..."
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tags (comma-separated, max 10)
                  <span className={`ml-2 text-xs font-normal ${getRemainingTags <= 2 ? 'text-red-600' : getRemainingTags <= 5 ? 'text-yellow-600' : 'text-gray-500'}`}>
                    {getRemainingTags} remaining
                  </span>
                </label>
                <input
                  type="text"
                  value={tagInputValue}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className={`w-full px-5 py-4 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    getCurrentTagCount >= 10
                      ? 'border-red-300 focus:ring-red-500'
                      : getCurrentTagCount >= 8
                        ? 'border-yellow-300 focus:ring-yellow-500'
                        : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="tag1, tag2, tag3..."
                />
                {getCurrentTagCount >= 10 && (
                  <p className="mt-1 text-xs text-red-600">
                    Maximum 10 tags allowed
                  </p>
                )}
              </div>

            </div>


            <div className="flex-1 flex flex-col min-h-[500px]">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content
              </label>
              <textarea
                value={editingPrompt.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="flex-1 w-full px-5 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-base resize-none"
                placeholder="Enter your prompt content here..."
              />
            </div>

            <div className="flex justify-end space-x-6 pt-8 border-t border-gray-200">
              <button
                onClick={onCancel}
                className="px-10 py-4 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium text-lg"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={!editingPrompt.title}
                className={`px-10 py-4 rounded-lg text-white transition-colors font-medium text-lg ${
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

export default PromptEditor