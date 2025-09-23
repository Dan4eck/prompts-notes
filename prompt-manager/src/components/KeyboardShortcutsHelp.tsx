import './KeyboardShortcutsHelp.css'

interface Shortcut {
  key: string
  keyString: string
  description: string
}

interface KeyboardShortcutsHelpProps {
  shortcuts: Shortcut[]
  onClose: () => void
}

export const KeyboardShortcutsHelp = ({ shortcuts, onClose }: KeyboardShortcutsHelpProps) => {
  return (
    <div className="shortcuts-help-overlay">
      <div className="shortcuts-help-modal">
        <div className="shortcuts-help-header">
          <h2>Keyboard Shortcuts</h2>
          <button onClick={onClose} className="shortcuts-help-close">
            ×
          </button>
        </div>
        <div className="shortcuts-help-content">
          <div className="shortcuts-list">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="shortcut-item">
                <kbd className="shortcut-key">{shortcut.keyString}</kbd>
                <span className="shortcut-description">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="shortcuts-help-footer">
          <p>Press <kbd>Esc</kbd> or click outside to close</p>
        </div>
      </div>
    </div>
  )
}