import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Flame, Mail, Lock, User, Calendar, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const GENDERS = ['male', 'female', 'non-binary', 'other'];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '', password: '', name: '', age: '', gender: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Email and password are required');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender) {
      toast.error('Please fill in all fields');
      return;
    }
    if (parseInt(form.age) < 18) {
      toast.error('You must be at least 18 years old');
      return;
    }

    const result = await signup(form);
    if (result.success) {
      toast.success(result.message);
      navigate('/edit-profile');
    } else {
      toast.error(result.message);
      setStep(1);
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
      <div style={{
        position: 'absolute', top: '-150px', left: '-150px',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(255, 68, 88, 0.1) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      <div className="glass animate-fadeInUp" style={{
        width: '100%', maxWidth: '460px',
        borderRadius: '28px',
        padding: '48px 40px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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
            fontSize: '30px', fontWeight: '800',
            fontFamily: 'Playfair Display, serif',
          }}>Create Account</h1>
          <p style={{ color: 'var(--flame-muted)', marginTop: '8px', fontSize: '15px' }}>
            Join millions finding love on Flamr 💕
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              height: '4px',
              flex: 1,
              maxWidth: '80px',
              borderRadius: '4px',
              background: s <= step ? 'var(--flame-gradient)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--flame-muted)',
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create password (min 6 chars)"
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
              style={{ width: '100%', padding: '15px', fontSize: '16px', marginTop: '8px' }}
            >
              Continue →
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--flame-muted)',
              }} />
              <input
                type="text"
                name="name"
                placeholder="Your first name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                style={{ paddingLeft: '46px' }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <Calendar size={18} style={{
                position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
                color: 'var(--flame-muted)',
              }} />
              <input
                type="number"
                name="age"
                placeholder="Your age (18+)"
                value={form.age}
                onChange={handleChange}
                min="18"
                max="100"
                className="input-field"
                style={{ paddingLeft: '46px' }}
              />
            </div>

            <div>
              <p style={{ color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '10px' }}>
                I am a...
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {GENDERS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: form.gender === g
                        ? '2px solid var(--flame-primary)'
                        : '1.5px solid rgba(255,255,255,0.1)',
                      background: form.gender === g
                        ? 'rgba(255, 68, 88, 0.1)'
                        : 'rgba(255,255,255,0.03)',
                      color: form.gender === g ? 'var(--flame-primary)' : 'var(--flame-muted)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: form.gender === g ? '600' : '400',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '15px' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
                style={{
                  flex: 2, padding: '15px', fontSize: '15px',
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'Creating...' : 'Create Account 🔥'}
              </button>
            </div>
          </form>
        )}

        <div style={{
          textAlign: 'center', marginTop: '28px',
          color: 'var(--flame-muted)', fontSize: '14px',
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--flame-primary)', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
