import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';

export default function AuthModal() {
  const { 
    authModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    closeAuth, 
    login, 
    register, 
    authLoading, 
    authError 
  } = useAuth();

  // Controlled form state
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rahul Sharma');
  const [username, setUsername] = useState('rahulsharma');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && authModalOpen) {
        closeAuth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, closeAuth]);

  if (!authModalOpen) return null;

  const validate = () => {
    const errs = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!password || password.length < 6) {
      errs.password = 'Password must be at least 6 characters long';
    }
    if (authModalMode === 'register') {
      if (!name || name.trim().length < 2) {
        errs.name = 'Please provide your full name';
      }
      if (!username || username.trim().length < 3) {
        errs.username = 'Username must be at least 3 characters';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (authModalMode === 'login') {
      await login(email, password);
    } else {
      await register({ name, username, email, password });
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuth}>
      <div className="modal-box modal-box-auth" onClick={(e) => e.stopPropagation()}>
        <button 
          type="button" 
          className="modal-close-btn" 
          onClick={closeAuth}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div className="auth-tabs-row">
          <button
            type="button"
            className={`auth-tab-btn ${authModalMode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalMode('login');
              setErrors({});
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authModalMode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setAuthModalMode('register');
              setErrors({});
            }}
          >
            Create Account
          </button>
        </div>

        <div className="auth-body">
          <h3 className="modal-title">
            {authModalMode === 'login' ? 'Welcome Back to Ketto' : 'Join 55 Lakh+ Donors'}
          </h3>
          <p className="modal-subtitle">
            {authModalMode === 'login'
              ? 'Access your donations, tax receipts, and active fundraisers'
              : 'Sign up to start fundraisers at 0% fee and track life-saving contributions'}
          </p>

          {(authError || errors.form) && (
            <div className="form-error-alert">
              <AlertCircle size={16} />
              <span>{authError || errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {authModalMode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'input-error' : ''}`}
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                    />
                  </div>
                  {errors.name && <p className="field-error-msg">{errors.name}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Username <span className="text-danger">*</span>
                  </label>
                  <div className="input-with-prefix">
                    <span className="input-prefix">@</span>
                    <input
                      type="text"
                      className={`form-input ${errors.username ? 'input-error' : ''}`}
                      placeholder="e.g. rahulsharma"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (errors.username) setErrors(prev => ({ ...prev, username: null }));
                      }}
                    />
                  </div>
                  {errors.username && <p className="field-error-msg">{errors.username}</p>}
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="rahul@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                />
              </div>
              {errors.email && <p className="field-error-msg">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-with-prefix">
                <span className="input-prefix">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                />
              </div>
              {errors.password && <p className="field-error-msg">{errors.password}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary-cta w-full"
              disabled={authLoading}
              style={{ marginTop: '16px', padding: '13px' }}
            >
              {authLoading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  <span>{authModalMode === 'login' ? 'Sign In' : 'Create My Account'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch-note">
            {authModalMode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => setAuthModalMode('register')}
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="link-btn" 
                  onClick={() => setAuthModalMode('login')}
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
