import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { X, Mail, Lock } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [authMode, setAuthMode] = useState('magiclink'); // 'magiclink' | 'password' | 'signup'

  if (!isOpen) return null;

  const handleMagicLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMessage({ text: 'Check your email for the login link!', type: 'success' });
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ text: 'Registration successful! You can now log in.', type: 'success' });
        setAuthMode('password');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // On success, App.jsx listener will pick it up and close the modal ultimately
        onClose(); 
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="auth-modal-content" onClick={e => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}><X size={24} /></button>
        
        <div className="auth-header">
          <h2>
            {authMode === 'magiclink' && 'Sign In'}
            {authMode === 'password' && 'Sign In'}
            {authMode === 'signup' && 'Create Account'}
          </h2>
          <p>Seamlessly track your orders and manage your details.</p>
        </div>

        <div className="auth-social-group">
          <button 
            type="button" 
            className="google-auth-btn" 
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        {message.text && (
          <div className={`auth-message ${message.type}`}>
            {message.text}
          </div>
        )}

        {authMode === 'magiclink' ? (
          <form className="auth-form" onSubmit={handleMagicLink}>
            <div className="auth-input-group">
              <Mail size={18} className="auth-icon" />
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
            <div className="auth-switch">
              or <button type="button" onClick={() => setAuthMode('password')}>Sign in with password</button>
            </div>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handlePasswordLogin}>
            <div className="auth-input-group">
              <Mail size={18} className="auth-icon" />
              <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="auth-input-group">
              <Lock size={18} className="auth-icon" />
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required minLength="6" />
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? 'Processing...' : (authMode === 'signup' ? 'Sign Up' : 'Log In')}
            </button>
            
            <div className="auth-switch">
              {authMode === 'password' ? (
                <>
                  <button type="button" onClick={() => setAuthMode('magiclink')}>Use magic link</button> |{' '}
                  <button type="button" onClick={() => setAuthMode('signup')}>Create account</button>
                </>
              ) : (
                <button type="button" onClick={() => setAuthMode('password')}>Already have an account? Log in.</button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
