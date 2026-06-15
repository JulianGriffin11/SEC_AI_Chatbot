import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setIsSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/chats', { replace: true })
  }

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to your account to continue."
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
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-10 border-gray-300 bg-gray-50 transition-smooth focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
          />
        </div>

        {error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 animate-slide-up" role="alert">
            <p className="text-sm text-red-800 font-medium">{error}</p>
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
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-smooth">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
