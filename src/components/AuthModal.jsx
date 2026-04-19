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
