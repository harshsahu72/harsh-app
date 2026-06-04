import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const doLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.success) {
      toast.success(result.message || 'Welcome back! 🔥');
      const state = useAuthStore.getState();
      navigate(state.user?.isProfileComplete ? '/discover' : '/edit-profile');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in both email and password.');
      return;
    }
    await doLogin(form.email, form.password);
  };

  const handleDemoLogin = async () => {
    setError('');
    await doLogin('demo@flamr.com', 'demo1234');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--aurora-bg)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background blobs */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div className="glass animate-fadeInUp" style={{
        width: '100%', maxWidth: '440px',
        borderRadius: '28px',
        padding: '48px 40px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'var(--aurora-gradient)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 30px rgba(124, 58, 237, 0.4)',
          }}>
            <Flame size={32} color="white" />
          </div>
          <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: '800' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--aurora-muted)', marginTop: '8px', fontSize: '15px' }}>
            Sign in to continue finding your match 🔥
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: 'rgba(255, 68, 88, 0.1)',
            border: '1px solid rgba(255, 68, 88, 0.35)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#FF6B7A',
            fontSize: '14px',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--aurora-muted)', zIndex: 5,
            }} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: '46px' }}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--aurora-muted)', zIndex: 5,
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: '46px', paddingRight: '46px' }}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--aurora-muted)', zIndex: 5,
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: '8px',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In 🔥'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ color: 'var(--aurora-muted)', fontSize: '12px' }}>or try demo</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        {/* Demo Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isLoading}
          style={{
            width: '100%', padding: '14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '14px',
            color: 'white', fontSize: '14px', fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            fontFamily: 'Outfit, sans-serif',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
        >
          🚀 Try Demo Account
        </button>

        <div style={{
          textAlign: 'center', marginTop: '24px',
          color: 'var(--aurora-muted)', fontSize: '14px',
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--aurora-primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign up free
          </Link>
        </div>
      </div>
    </div>
  );
}
