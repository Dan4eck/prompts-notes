export interface Prompt {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
}

export interface PromptFormData {
  title: string
  content: string
  tags: string[]
}

export interface PromptListProps {
  prompts: Prompt[]
  searchQuery: string
  selectedTags: string[]
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
  onCreateNew: () => void
}

export interface PromptEditorProps {
  editingPrompt: Partial<Prompt>
  onEditPromptChange: (prompt: Partial<Prompt>) => void
  onSave: () => void
  onCancel: () => void
}

export interface PromptCardProps {
  prompt: Prompt
  onEdit: (prompt: Prompt) => void
  onDelete: (id: string) => void
  onCopy: (content: string) => void
}

export interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
}

export interface TagFilterProps {
  availableTags: string[]
  selectedTags: string[]
  onTagToggle: (tag: string) => void
}

export interface ExportMenuProps {
  prompts: Prompt[]
  onExportToJson: () => void
  onExportToCsv: () => void
}

export interface StorageService {
  loadPrompts(): Promise<Prompt[]>
  savePrompts(prompts: Prompt[]): Promise<void>
}

export type ViewMode = 'list' | 'edit'

export interface SortOption {
  value: string
  label: string
}

export interface FilterOptions {
  searchQuery: string
  selectedTags: string[]
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}