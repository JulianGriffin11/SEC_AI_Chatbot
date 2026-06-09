/**
 * Ultra-Simple Test Component
 * Completely independent of any external files, styles, or packages.
 */
function App() {
  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: '#ffffff', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '16px',
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)'
      }}>
        <h1 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>Engine Check Active</h1>
        <p style={{ color: '#94a3b8', margin: '0' }}>
          Julian, if you can see this card, your core Vite and React setup is 100% functional!
        </p>
      </div>
    </div>
  )
}

export default App