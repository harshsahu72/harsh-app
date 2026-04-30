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
      {/* Dynamic Background Blobs */}
      <div className="aurora-blob" style={{ 
        top: '-10%', right: '-5%', 
        background: 'radial-gradient(circle, var(--aurora-primary) 0%, transparent 70%)',
        animationDelay: '0s'
      }} />
      <div className="aurora-blob" style={{ 
        bottom: '10%', left: '-10%', 
        background: 'radial-gradient(circle, var(--aurora-secondary) 0%, transparent 70%)',
        animationDelay: '-5s'
      }} />
      <div className="aurora-blob" style={{ 
        top: '40%', right: '15%', 
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, var(--aurora-accent) 0%, transparent 70%)',
        opacity: 0.3,
        animationDelay: '-2s'
      }} />

      {/* Navigation */}
      <nav className="nav-blur" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 8%', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      }}>
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          <div style={{
            width: '40px', height: '40px',
            background: 'var(--aurora-gradient)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--aurora-glow)',
          }}>
            <Flame size={22} color="white" />
          </div>
          <span className="gradient-text" style={{
            fontWeight: '900', fontSize: '24px',
            letterSpacing: '-0.5px'
          }}>Flamr</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', gap: '24px', alignItems: 'center' }}
        >
          <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>
            Log In
          </Link>
          <Link to="/signup" className="btn-premium" style={{ padding: '10px 24px', fontSize: '14px' }}>
            Join Now
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main style={{
        padding: '180px 8% 100px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        alignItems: 'center',
        gap: '60px',
        position: 'relative',
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '100px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            marginBottom: '24px',
            fontSize: '14px',
            color: 'var(--aurora-secondary)',
            fontWeight: '600'
          }}>
            <Sparkles size={16} />
            Elevate your dating experience
          </div>

          <h1 style={{
            fontSize: 'clamp(48px, 6vw, 84px)',
            fontWeight: '900',
            lineHeight: '1.1',
            letterSpacing: '-2px',
            marginBottom: '32px',
          }}>
            Find Your <br />
            <span className="gradient-text">Cosmic</span> Connection.
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'var(--aurora-muted)',
            maxWidth: '600px',
            lineHeight: '1.6',
            marginBottom: '48px',
          }}>
            Beyond swiping. We use advanced affinity mapping to find people 
            who resonate with your energy. Discover love in the digital nebula.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn-premium">
              Launch Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-outline">
              Explore Nebula
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '40px', marginTop: '64px' }}>
            {[
              { val: '98%', label: 'Match Accuracy' },
              { val: '2M+', label: 'Stellar Pairs' },
            ].map(stat => (
              <div key={stat.label}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'white' }}>{stat.val}</div>
                <div style={{ color: 'var(--aurora-muted)', fontSize: '14px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hero Visual Artifact */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
        >
          <div style={{
            width: '400px',
            height: '520px',
            borderRadius: '40px',
            background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url("https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 50px 100px -20px rgba(0,0,0,0.8)',
            transform: 'rotate(3deg)',
            position: 'relative',
            zIndex: 2
          }}>
            <div className="glass" style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              padding: '20px',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              <div style={{ fontWeight: '800', fontSize: '18px' }}>Elena, 24</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>"Looking for someone to explore the universe with."</div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="animate-spin-slow" style={{
            position: 'absolute',
            top: '-40px',
            right: '-20px',
            width: '200px',
            height: '200px',
            border: '1px dashed var(--aurora-secondary)',
            borderRadius: '50%',
            opacity: 0.3,
            zIndex: 1
          }} />
        </motion.div>
      </main>

      {/* Feature Grid */}
      <section style={{ padding: '100px 8%', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h2 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>The Flamr Architecture</h2>
          <p style={{ color: 'var(--aurora-muted)', fontSize: '18px' }}>Designed for meaningful resonance, not just matching.</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px'
        }}>
          {[
            {
              icon: <Target className="gradient-text" size={32} />,
              title: "Affinity Mapping",
              desc: "Our neural core analyzes psychometric data to predict long-term compatibility."
            },
            {
              icon: <Shield className="gradient-text" size={32} />,
              title: "Quantum Security",
              desc: "Your data is encrypted using state-of-the-art protocols. Privacy is our prime directive."
            },
            {
              icon: <Users className="gradient-text" size={32} />,
              title: "Vetted Community",
              desc: "A strictly curated ecosystem ensures you only interact with authentic, verified individuals."
            },
            {
              icon: <Globe className="gradient-text" size={32} />,
              title: "Global Reach",
              desc: "Connect with extraordinary people across continents or in your immediate vicinity."
            },
            {
              icon: <Zap className="gradient-text" size={32} />,
              title: "Instant Resonance",
              desc: "Real-time notifications and fluid messaging keep the energy flowing without delays."
            },
            {
              icon: <Sparkles className="gradient-text" size={32} />,
              title: "Premium Orbit",
              desc: "Unlock advanced discovery tools and 10x visibility with our elite membership tiers."
            }
          ].map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass feature-card"
              style={{
                padding: '40px',
                borderRadius: '32px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div style={{ marginBottom: '24px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '16px' }}>{feature.title}</h3>
              <p style={{ color: 'var(--aurora-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '100px 8% 160px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass" style={{
          padding: '100px 40px',
          borderRadius: '48px',
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1) 0%, transparent 80%)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: '900', marginBottom: '24px' }}>
            Ready to find your <span className="gradient-text">Flame?</span>
          </h2>
          <p style={{ fontSize: '20px', color: 'var(--aurora-muted)', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Join the elite circle of individuals who have found their perfect resonance.
          </p>
          <Link to="/signup" className="btn-premium" style={{ padding: '20px 60px', fontSize: '18px' }}>
            Start Your Discovery
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '60px 8%',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'var(--aurora-muted)',
        fontSize: '14px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div>© 2026 Flamr Industries. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '32px' }}>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Guidelines</a>
        </div>
      </footer>
    </div>
  );
}

