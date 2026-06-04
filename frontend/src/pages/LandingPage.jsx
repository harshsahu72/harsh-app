import { Link } from 'react-router-dom';
import { Flame, Heart, MessageCircle, Shield, Zap, Star, ArrowRight, Sparkles, Target, Users, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--aurora-bg)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Aurora Blobs */}
      <div className="aurora-blob" style={{
        top: '-10%', right: '-5%',
        background: 'radial-gradient(circle, var(--aurora-primary) 0%, transparent 70%)',
      }} />
      <div className="aurora-blob" style={{
        bottom: '10%', left: '-10%',
        background: 'radial-gradient(circle, var(--aurora-secondary) 0%, transparent 70%)',
        animationDelay: '-5s',
      }} />
      <div className="aurora-blob" style={{
        top: '40%', right: '15%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, var(--aurora-accent) 0%, transparent 70%)',
        opacity: 0.25,
        animationDelay: '-2s',
      }} />

      {/* Navigation */}
      <nav className="nav-blur" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 5%',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <div style={{
            width: '32px', height: '32px',
            background: 'var(--aurora-gradient)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--aurora-glow)',
            flexShrink: 0,
          }}>
            <Flame size={18} color="white" />
          </div>
          <span className="gradient-text" style={{ fontWeight: '900', fontSize: '20px', letterSpacing: '-0.5px' }}>
            Flamr
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', fontSize: '14px' }}>
            Log In
          </Link>
          <Link to="/signup" className="btn-premium" style={{ padding: '8px 18px', fontSize: '13px' }}>
            Join Now
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section — CSS-driven responsive (no window.innerWidth) */}
      <main className="hero-main">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ flex: '1 1 0', minWidth: 0 }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.05)',
            padding: '7px 14px', borderRadius: '100px',
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: '24px',
            fontSize: '13px', color: 'var(--aurora-secondary)', fontWeight: '600',
          }}>
            <Sparkles size={14} />
            Elevate your dating experience
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 80px)',
            fontWeight: '900',
            lineHeight: '1.1',
            letterSpacing: '-2px',
            marginBottom: '20px',
          }}>
            Find Your <br />
            <span className="gradient-text">Cosmic</span> Connection.
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 3vw, 19px)',
            color: 'var(--aurora-muted)',
            maxWidth: '560px',
            lineHeight: '1.65',
            marginBottom: '36px',
            margin: '0 auto 36px',
          }}>
            Beyond swiping. We use advanced affinity mapping to find people
            who resonate with your energy.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta" style={{
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '40px',
          }}>
            <Link to="/signup" className="btn-premium">
              Launch Your Journey <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn-outline">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-stats" style={{ display: 'flex', gap: '36px' }}>
            {[
              { val: '98%', label: 'Match Accuracy' },
              { val: '2M+', label: 'Stellar Pairs' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '26px', fontWeight: '800', color: 'white' }}>{stat.val}</div>
                <div style={{ color: 'var(--aurora-muted)', fontSize: '13px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            flex: '0 0 auto',
            width: 'min(320px, 85vw)',
            position: 'relative',
          }}
        >
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            borderRadius: '28px',
            background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.45)), url("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 40px 80px -20px rgba(0,0,0,0.8)',
            position: 'relative',
          }}>
            <div className="glass" style={{
              position: 'absolute', bottom: '16px', left: '16px', right: '16px',
              padding: '14px 16px', borderRadius: '18px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'left',
            }}>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>Elena, 24</div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '3px' }}>
                "Looking for someone to explore the universe with."
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Grid */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 6%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '800', marginBottom: '14px' }}>
            The Flamr Architecture
          </h2>
          <p style={{ color: 'var(--aurora-muted)', fontSize: 'clamp(14px, 2vw, 18px)', maxWidth: '500px', margin: '0 auto' }}>
            Designed for meaningful resonance, not just matching.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: <Target size={28} className="gradient-text" />, title: 'Affinity Mapping', desc: 'Our neural core analyzes psychometric data to predict long-term compatibility.' },
            { icon: <Shield size={28} className="gradient-text" />, title: 'Quantum Security', desc: 'Your data is encrypted using state-of-the-art protocols. Privacy is our prime directive.' },
            { icon: <Users size={28} className="gradient-text" />, title: 'Vetted Community', desc: 'A strictly curated ecosystem ensures authentic, verified individuals only.' },
            { icon: <Globe size={28} className="gradient-text" />, title: 'Global Reach', desc: 'Connect with extraordinary people across continents or nearby.' },
            { icon: <Zap size={28} className="gradient-text" />, title: 'Instant Resonance', desc: 'Real-time notifications and fluid messaging keep the energy flowing.' },
            { icon: <Sparkles size={28} className="gradient-text" />, title: 'Premium Orbit', desc: 'Unlock advanced discovery tools and 10x visibility with elite membership.' },
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="glass feature-card"
              style={{
                padding: 'clamp(24px, 4vw, 40px)',
                borderRadius: '28px',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: '700', marginBottom: '12px' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--aurora-muted)', lineHeight: '1.6', fontSize: '14px' }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section style={{ padding: 'clamp(40px, 8vw, 80px) 6% clamp(80px, 12vw, 160px)', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass" style={{
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 5vw, 40px)',
          borderRadius: '40px',
          background: 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.08) 0%, transparent 80%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {/* Trial badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(124, 58, 237, 0.4)',
            padding: '6px 16px', borderRadius: '100px',
            fontSize: '13px', fontWeight: '700', color: 'var(--aurora-secondary)',
            marginBottom: '24px',
          }}>
            ✨ 24-Hour Free Trial — Then ₹499/month
          </div>

          <h2 style={{ fontSize: 'clamp(26px, 5vw, 52px)', fontWeight: '900', marginBottom: '16px' }}>
            Ready to find your <span className="gradient-text">Flame?</span>
          </h2>
          <p style={{
            fontSize: 'clamp(14px, 2vw, 18px)',
            color: 'var(--aurora-muted)',
            marginBottom: '40px',
            maxWidth: '500px',
            margin: '0 auto 40px',
            lineHeight: '1.65',
          }}>
            Start free for 24 hours. Then continue your journey for just ₹499/month.
            Cancel anytime.
          </p>
          <Link to="/signup" className="btn-premium" style={{ padding: 'clamp(14px,3vw,18px) clamp(28px,5vw,52px)', fontSize: 'clamp(14px,2vw,17px)' }}>
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(24px, 4vw, 40px) 6%',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
        color: 'var(--aurora-muted)',
        fontSize: '13px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div>© 2026 Flamr. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Guidelines</a>
        </div>
      </footer>
    </div>
  );
}
