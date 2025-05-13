import React, { useState } from 'react'
import { Mail } from 'lucide-react'

export const EmailCapture = () => {
  const [email, setEmail] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string, isError: boolean } | null>(null)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!email) {
      setMessage({ text: 'Please enter your email address', isError: true })
      return
    }
    
    if (!isChecked) {
      setMessage({ text: 'Please accept the privacy policy', isError: true })
      return
    }
    
    // Submit the form (static implementation for now)
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setMessage({ text: 'Thanks for subscribing!', isError: false })
      setEmail('')
      setIsChecked(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }, 1000)
  }
  
  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock the next drop</h2>
          <p className="text-xl text-white/80 mb-8">
            Get architect-verified listings in your inbox.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={`bg-[#FF6B4A] hover:bg-[#FF8B6A] text-white px-8 py-4 rounded-full font-medium transition-colors inline-flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              <Mail className="w-5 h-5" />
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 text-sm ${message.isError ? 'text-red-400' : 'text-green-400'}`}>
              {message.text}
            </div>
          )}
          
          <div className="mt-6 flex items-center gap-2 justify-center">
            <input 
              type="checkbox" 
              id="gdpr" 
              className="rounded" 
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="gdpr" className="text-sm text-white/60">
              I agree to receive emails and accept the privacy policy
            </label>
          </div>
        </div>
      </div>
    </section>
  )
} 