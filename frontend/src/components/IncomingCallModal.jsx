import { useEffect, useState } from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';

const DEMO_PHOTO =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';

export default function IncomingCallModal({ remoteUser, callType, onAccept, onReject }) {
  const photo = remoteUser?.photos?.[0] || DEMO_PHOTO;
  const [elapsed, setElapsed] = useState(0);

  // Auto-decline after 30s
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (elapsed >= 30) onReject();
  }, [elapsed, onReject]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(5, 5, 10, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Pulse rings */}
      <div className="incoming-call-rings">
        <div className="call-ring ring-1" />
        <div className="call-ring ring-2" />
        <div className="call-ring ring-3" />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'relative',
          zIndex: 10,
          padding: '40px 32px',
          textAlign: 'center',
          animation: 'fadeInUp 0.4s ease',
        }}
      >
        {/* Call type badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(124, 58, 237, 0.15)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '100px',
            padding: '6px 14px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--aurora-primary)',
          }}
        >
          {callType === 'video' ? <Video size={14} /> : <Phone size={14} />}
          Incoming {callType === 'video' ? 'Video' : 'Voice'} Call
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <img
            src={photo}
            alt={remoteUser?.name}
            onError={(e) => { e.target.src = DEMO_PHOTO; }}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '4px solid var(--aurora-primary)',
              boxShadow: '0 0 40px rgba(124, 58, 237, 0.5)',
            }}
          />
        </div>

        {/* Name */}
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '6px' }}>
            {remoteUser?.name || 'Unknown'}
          </h2>
          <p style={{ color: 'var(--aurora-muted)', fontSize: '14px' }}>
            {callType === 'video' ? '📹 Wants to video call you' : '📞 Wants to voice call you'}
          </p>
        </div>

        {/* Auto-decline timer */}
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
          Auto-declining in {30 - elapsed}s
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '40px', marginTop: '8px' }}>
          {/* Reject */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              id="call-reject-btn"
              onClick={onReject}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF4458, #FF6B35)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(255, 68, 88, 0.5)',
                transition: 'all 0.2s ease',
                color: 'white',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <PhoneOff size={28} />
            </button>
            <span style={{ color: 'var(--aurora-muted)', fontSize: '12px', fontWeight: '500' }}>Decline</span>
          </div>

          {/* Accept */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <button
              id="call-accept-btn"
              onClick={onAccept}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #00D26A, #00B359)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(0, 210, 106, 0.5)',
                transition: 'all 0.2s ease',
                color: 'white',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
            >
              <Phone size={28} />
            </button>
            <span style={{ color: 'var(--aurora-muted)', fontSize: '12px', fontWeight: '500' }}>Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}
