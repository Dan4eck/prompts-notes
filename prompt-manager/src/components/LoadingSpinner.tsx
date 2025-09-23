import './LoadingSpinner.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  message?: string
}

export const LoadingSpinner = ({ size = 'medium', message }: LoadingSpinnerProps) => {
  return (
    <div className={`loading-spinner loading-spinner--${size}`}>
      <div className="loading-spinner__spinner"></div>
      {message && <p className="loading-spinner__message">{message}</p>}
    </div>
  )
}