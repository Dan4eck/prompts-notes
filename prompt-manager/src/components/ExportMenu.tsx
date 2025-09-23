import './ExportMenu.css'

import type { ExportMenuProps } from '../types'

function ExportMenu({ prompts, onExportToJson, onExportToCsv }: ExportMenuProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onExportToJson}
        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        disabled={prompts.length === 0}
      >
        Export JSON
      </button>
      <button
        onClick={onExportToCsv}
        className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
        disabled={prompts.length === 0}
      >
        Export CSV
      </button>
    </div>
  )
}

export default ExportMenu