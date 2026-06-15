import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export function SignUp() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    setIsSubmitting(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      navigate('/chats', { replace: true })
      return
    }

    setMessage('Account created! Check your email to confirm your address, then sign in.')
  }

  return (
    <AuthLayout
      title="Get started"
      description="Create your account to start using Document Copilot."
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-medium text-gray-900">
            Email address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@company.com"
            className="h-10 border-gray-300 bg-gray-50 placeholder:text-gray-400 transition-smooth focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="password" className="text-sm font-medium text-gray-900">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 6 characters"
            className="h-10 border-gray-300 bg-gray-50 placeholder:text-gray-400 transition-smooth focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
            Confirm password
          </Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="h-10 border-gray-300 bg-gray-50 placeholder:text-gray-400 transition-smooth focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 animate-slide-up" role="alert">
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        ) : null}

        {message ? (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3 animate-slide-up" role="status">
            <p className="text-sm text-green-800">{message}</p>
          </div>
        ) : null}

        <Button 
          type="submit" 
          className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-smooth shadow-sm" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700 transition-smooth">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
