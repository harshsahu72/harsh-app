import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success(result.message);
      navigate('/discover');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--flame-dark)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', top: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(255, 68, 88, 0.12) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', left: '-100px',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(253, 41, 123, 0.08) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <div className="glass animate-fadeInUp" style={{
        width: '100%', maxWidth: '440px',
        borderRadius: '28px',
        padding: '48px 40px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'var(--flame-gradient)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 30px rgba(255, 68, 88, 0.4)',
          }}>
            <Flame size={32} color="white" />
          </div>
          <h1 className="gradient-text" style={{
            fontSize: '32px', fontWeight: '800',
            fontFamily: 'Playfair Display, serif',
          }}>Welcome back</h1>
          <p style={{ color: 'var(--flame-muted)', marginTop: '8px', fontSize: '15px' }}>
            Sign in to continue finding your match 🔥
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--flame-muted)',
            }} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: '46px' }}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--flame-muted)',
            }} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="input-field"
              style={{ paddingLeft: '46px', paddingRight: '46px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--flame-muted)',
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
              padding: '15px',
              fontSize: '16px',
              marginTop: '8px',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In 🔥'}
          </button>
        </form>

        <div style={{
          textAlign: 'center', marginTop: '28px',
          color: 'var(--flame-muted)', fontSize: '14px',
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--flame-primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign up free
          </Link>
        </div>

        {/* Demo credentials notice */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(255, 68, 88, 0.05)',
          border: '1px solid rgba(255, 68, 88, 0.15)',
          borderRadius: '12px',
          padding: '14px 16px',
          fontSize: '13px',
          color: 'var(--flame-muted)',
          textAlign: 'center',
        }}>
          💡 New here? Create an account to start swiping!
        </div>
      </div>
    </div>
  );
}
