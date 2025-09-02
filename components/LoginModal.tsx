'use client'
import { useState } from 'react'

export default function LoginModal({ config, onAuthenticated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Vérification des identifiants
    if (username === config.credentials.username && password === config.credentials.password) {
      onAuthenticated()
    } else {
      setError('Identifiants incorrects')
    }
    
    setLoading(false)
  }

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>MonAssistant Pro</h2>
          <p>{config.businessName}</p>
        </div>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Identifiant :</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre identifiant"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          
          <div className="login-info">
            <small>Demo : test / test</small>
          </div>
        </form>
      </div>
    </div>
  )
}
