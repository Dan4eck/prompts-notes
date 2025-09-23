import './PromptCard.css'

import type { PromptCardProps } from '../types'

function PromptCard({ prompt, onEdit, onDelete, onCopy }: PromptCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{prompt.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onCopy(prompt.content)}
            className="text-gray-500 hover:text-gray-700 text-sm"
            title="Copy to clipboard"
          >
            📋
          </button>
          <button
            onClick={() => onEdit(prompt)}
            className="text-gray-500 hover:text-gray-700 text-sm"
            title="Edit prompt"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
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
  )
}

export default PromptCard