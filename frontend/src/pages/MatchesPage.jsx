import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Heart, MapPin } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=200&h=200&fit=crop&crop=face',
];

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get('/matches');
        setMatches(data.matches);
      } catch (err) {
        toast.error('Failed to load matches');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
      }}>
        <div style={{
          width: '50px', height: '50px',
          border: '3px solid rgba(255, 68, 88, 0.2)',
          borderTop: '3px solid var(--flame-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      padding: '28px 24px',
      maxWidth: '900px',
      margin: '0 auto',
    }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>
          Your Matches 💕
        </h1>
        <p style={{ color: 'var(--flame-muted)', fontSize: '14px' }}>
          {matches.length} {matches.length === 1 ? 'person' : 'people'} liked you back
        </p>
      </div>

      {matches.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '80px 24px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px',
        }}>
          <div style={{ fontSize: '80px' }}>💔</div>
          <h2 style={{ fontSize: '22px', fontWeight: '700' }}>No matches yet</h2>
          <p style={{ color: 'var(--flame-muted)', maxWidth: '280px', lineHeight: '1.6' }}>
            Keep swiping! Your perfect match is just around the corner 🔥
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/discover')}
            style={{ padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Heart size={16} />
            Start Swiping
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {matches.map((match, idx) => {
            const user = match.user;
            if (!user) return null;
            const photo = user.photos?.[0] || DEMO_PHOTOS[idx % DEMO_PHOTOS.length];

            return (
              <div
                key={match.matchId}
                className="glass"
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => navigate(`/chat/${match.conversationId}`)}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.4)';
                  e.currentTarget.style.borderColor = 'rgba(255, 68, 88, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                {/* Photo */}
                <div style={{ position: 'relative', height: '200px' }}>
                  <img
                    src={photo}
                    alt={user.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={e => { e.target.src = DEMO_PHOTOS[0]; }}
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                  }} />
                  <div style={{
                    position: 'absolute', bottom: '12px', left: '12px',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: '#00D26A',
                      boxShadow: '0 0 6px #00D26A',
                    }} />
                    <span style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>Online</span>
                  </div>

                  {/* New message indicator */}
                  {match.lastMessage && (
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: 'var(--flame-gradient)',
                      borderRadius: '50%', width: '20px', height: '20px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', color: 'white', fontWeight: '700',
                    }}>
                      !
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '2px' }}>
                        {user.name}, {user.age}
                      </h3>
                      {user.location?.city && (
                        <p style={{
                          color: 'var(--flame-muted)', fontSize: '12px',
                          display: 'flex', alignItems: 'center', gap: '3px',
                        }}>
                          <MapPin size={11} />
                          {user.location.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {match.lastMessage ? (
                    <p style={{
                      color: 'var(--flame-muted)', fontSize: '13px',
                      marginTop: '8px', fontStyle: 'italic',
                      display: '-webkit-box', WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    }}>
                      💬 {match.lastMessage.content}
                    </p>
                  ) : (
                    <p style={{ color: 'var(--flame-muted)', fontSize: '13px', marginTop: '8px' }}>
                      ✨ New match! Say hello
                    </p>
                  )}

                  <button
                    style={{
                      width: '100%', marginTop: '14px',
                      background: 'var(--flame-gradient)',
                      border: 'none', borderRadius: '12px',
                      padding: '10px',
                      color: 'white', fontSize: '14px', fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                  >
                    <MessageCircle size={16} />
                    Message
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
