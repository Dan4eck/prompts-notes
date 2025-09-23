import './ErrorMessage.css'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export const ErrorMessage = ({ message, onRetry, onDismiss }: ErrorMessageProps) => {
  return (
    <div className="error-message">
      <div className="error-message__content">
        <span className="error-message__icon">⚠️</span>
        <p className="error-message__text">{message}</p>
      </div>
      <div className="error-message__actions">
        {onRetry && (
          <button onClick={onRetry} className="error-message__retry">
            Try Again
          </button>
        )}
        {onDismiss && (
          <button onClick={onDismiss} className="error-message__dismiss">
            Dismiss
          </button>
        )}
      </div>
    </div>
  )
}