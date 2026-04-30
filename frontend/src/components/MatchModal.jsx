import { Heart, MessageCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&crop=face',
];

export default function MatchModal({ matchData, onClose }) {
  const navigate = useNavigate();
  const { matchedUser, conversationId } = matchData;

  const handleChat = () => {
    onClose();
    navigate(`/chat/${conversationId}`);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="animate-match-pop glass" style={{
        borderRadius: '32px',
        padding: '48px 40px',
        textAlign: 'center',
        maxWidth: '380px',
        width: '90%',
        position: 'relative',
        border: '1px solid rgba(255, 68, 88, 0.3)',
        background: 'rgba(26, 26, 46, 0.95)',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.1)',
            border: 'none', borderRadius: '50%',
            width: '36px', height: '36px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'white',
          }}
        >
          <X size={18} />
        </button>

        {/* Flame animation */}
        <div style={{ fontSize: '60px', marginBottom: '8px' }} className="animate-heartbeat">🔥</div>

        <h2 className="gradient-text" style={{
          fontSize: '32px', fontWeight: '900',
          fontFamily: 'Playfair Display, serif',
          marginBottom: '8px',
        }}>
          It's a Match!
        </h2>

        <p style={{ color: 'var(--flame-muted)', fontSize: '15px', marginBottom: '32px' }}>
          You and <strong style={{ color: 'white' }}>{matchedUser?.name}</strong> liked each other 💕
        </p>

        {/* Photos */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          alignItems: 'center', gap: '-16px',
          marginBottom: '32px',
          position: 'relative',
        }}>
          <div style={{
            width: '100px', height: '100px',
            borderRadius: '50%',
            border: '4px solid var(--flame-primary)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(255, 68, 88, 0.5)',
            marginRight: '-16px',
            zIndex: 2,
          }}>
            <img
              src={DEMO_PHOTOS[0]}
              alt="You"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = DEMO_PHOTOS[0]; }}
            />
          </div>

          {/* Heart */}
          <div style={{
            width: '40px', height: '40px',
            background: 'var(--flame-gradient)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3,
            border: '3px solid var(--flame-dark)',
            boxShadow: '0 4px 15px rgba(255, 68, 88, 0.6)',
          }}>
            <Heart size={18} fill="white" color="white" />
          </div>

          <div style={{
            width: '100px', height: '100px',
            borderRadius: '50%',
            border: '4px solid var(--flame-accent)',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(253, 41, 123, 0.5)',
            marginLeft: '-16px',
            zIndex: 2,
          }}>
            <img
              src={matchedUser?.photos?.[0] || DEMO_PHOTOS[1]}
              alt={matchedUser?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = DEMO_PHOTOS[1]; }}
            />
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            className="btn-primary"
            onClick={handleChat}
            style={{
              width: '100%', padding: '15px',
              fontSize: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <MessageCircle size={18} />
            Send a Message
          </button>
          <button
            className="btn-secondary"
            onClick={onClose}
            style={{ width: '100%', padding: '15px' }}
          >
            Keep Swiping 🔥
          </button>
        </div>
      </div>
    </div>
  );
}
