import React from 'react'
import { Button } from './ui/button'
import { useApp } from '../context/AppContext'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Optional: log to an error reporting service
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, info)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      const isArabic = document.documentElement.getAttribute('lang') === 'ar'
      return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-lg text-center mx-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isArabic ? 'حدث خطأ ما' : 'Something went wrong'}
            </h2>
            <p className="text-gray-600 mb-6">
              {this.state.error?.message || (isArabic ? 'حدث خطأ غير متوقع.' : 'An unexpected error occurred.')}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline">
                {isArabic ? 'حاول مرة أخرى' : 'Try Again'}
              </Button>
              <Button onClick={() => window.history.back()}>
                {isArabic ? 'رجوع' : 'Go Back'}
              </Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
