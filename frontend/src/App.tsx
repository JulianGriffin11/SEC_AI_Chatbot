import { useState } from 'react'

/**
 * Clean Single-File Login Sign-In Component
 * Handles local form tracking and credential processing.
 */
function App() {
  // Track inputs inside local React state hooks
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  /**
   * Intercept form submission to prevent page reload
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Log credentials to verify state tracking works perfectly
    console.log('--- Julian\'s Core Login Auth Check ---')
    console.log('Submitted Email:', email)
    console.log('Submitted Password:', password)
    
    alert(`Signing in with:\nEmail: ${email}\nPassword: ${password}`)
  }

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '32px',
        borderRadius: '16px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)'
      }}>
        {/* Header Block */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#f8fafc', margin: '0 0 8px 0' }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0' }}>
            Enter your credentials to access Document Copilot
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Email Field Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address
            </label>
            <input 
              type="email" 
              placeholder="julian@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Password Field Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#0f172a',
                border: '1px solid #475569',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Action Button */}
          <button 
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '8px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
          >
            Sign In
          </button>

        </form>
      </div>
    </div>
  )
}

export default App