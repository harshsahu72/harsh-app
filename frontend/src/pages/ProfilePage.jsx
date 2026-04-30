import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  User, MapPin, Heart, Settings, LogOut, Edit3,
  Star, Camera, Info, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_PHOTO = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  const profilePhoto = !imgError && user?.photos?.[0] ? user.photos[0] : DEMO_PHOTO;

  const handleLogout = () => {
    logout();
    toast.success('See you soon! 👋');
    navigate('/');
  };

  const completionPercent = () => {
    let score = 0;
    if (user?.name) score += 20;
    if (user?.bio) score += 20;
    if (user?.photos?.length > 0) score += 30;
    if (user?.interests?.length > 0) score += 20;
    if (user?.location?.city) score += 10;
    return score;
  };

  const pct = completionPercent();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px' }}>
      {/* Profile Header Card */}
      <div className="glass" style={{
        borderRadius: '24px', overflow: 'hidden', marginBottom: '20px',
      }}>
        {/* Cover */}
        <div style={{
          height: '100px',
          background: 'var(--flame-gradient)',
          position: 'relative',
        }} />

        {/* Avatar + info */}
        <div style={{ padding: '0 24px 28px', position: 'relative' }}>
          {/* Avatar */}
          <div style={{
            position: 'relative', display: 'inline-block',
            marginTop: '-50px',
          }}>
            <img
              src={profilePhoto}
              alt={user?.name}
              onError={() => setImgError(true)}
              style={{
                width: '100px', height: '100px',
                borderRadius: '50%',
                border: '4px solid var(--flame-dark)',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <button
              onClick={() => navigate('/edit-profile')}
              style={{
                position: 'absolute', bottom: '4px', right: '4px',
                width: '28px', height: '28px',
                background: 'var(--flame-gradient)',
                border: '2px solid var(--flame-dark)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white',
              }}
            >
              <Camera size={13} />
            </button>
          </div>

          {/* Name & info */}
          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {user?.name || 'Your Name'}, {user?.age || '?'}
                {user?.isVerified && (
                  <div title="Verified Account" style={{ color: '#448AFF', display: 'flex', alignItems: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                )}
              </h1>
              <p style={{
                color: 'var(--flame-muted)', fontSize: '14px',
                display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px',
              }}>
                {user?.location?.city ? (
                  <><MapPin size={13} /> {user.location.city}{user.location.country ? `, ${user.location.country}` : ''}</>
                ) : (
                  <><MapPin size={13} /> Add your location</>
                )}
              </p>
            </div>
            <button
              onClick={() => navigate('/edit-profile')}
              className="btn-primary"
              style={{
                padding: '10px 18px', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          </div>

          {/* Bio */}
          {user?.bio ? (
            <p style={{
              color: 'rgba(255,255,255,0.75)', fontSize: '14px',
              marginTop: '14px', lineHeight: '1.6',
            }}>
              {user.bio}
            </p>
          ) : (
            <p style={{
              color: 'var(--flame-muted)', fontSize: '14px',
              marginTop: '14px', fontStyle: 'italic',
            }}>
              Add a bio to attract more matches ✨
            </p>
          )}

          {/* Interests */}
          {user?.interests?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
              {user.interests.map(i => (
                <span key={i} className="chip selected">{i}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="glass" style={{
        borderRadius: '20px', padding: '20px', marginBottom: '20px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600' }}>Profile Strength</div>
            <div style={{ fontSize: '13px', color: 'var(--flame-muted)', marginTop: '2px' }}>
              {pct < 100 ? `${100 - pct}% to go for a stronger profile!` : 'Excellent profile! 🎉'}
            </div>
          </div>
          <div className="gradient-text" style={{ fontSize: '24px', fontWeight: '800' }}>{pct}%</div>
        </div>
        <div style={{
          height: '6px', background: 'rgba(255,255,255,0.08)',
          borderRadius: '6px', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: 'var(--flame-gradient)',
            borderRadius: '6px',
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px', marginBottom: '20px',
      }}>
        {[
          { icon: '❤️', label: 'Matches', value: user?.matches?.length || 0 },
          { icon: '👀', label: 'Profile Views', value: '—' },
          { icon: '⭐', label: 'Super Likes', value: '—' },
        ].map(stat => (
          <div key={stat.label} className="glass" style={{
            borderRadius: '16px', padding: '16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{stat.icon}</div>
            <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '2px' }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: 'var(--flame-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Settings Menu */}
      <div className="glass" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '20px' }}>
        {[
          { icon: <Settings size={18} />, label: 'Account Settings', onClick: () => navigate('/edit-profile') },
          { icon: <Heart size={18} color="var(--flame-primary)" />, label: 'My Matches', onClick: () => navigate('/matches') },
          { icon: <Star size={18} color="#FFC107" />, label: 'Upgrade to Premium', onClick: () => toast('Premium coming soon! 🔥') },
          { icon: <Info size={18} />, label: 'Help & Support', onClick: () => toast('Support portal coming soon!') },
        ].map((item, i) => (
          <button
            key={item.label}
            onClick={item.onClick}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              borderBottom: i < 3 ? '1px solid var(--flame-border)' : 'none',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: '14px',
              color: 'var(--flame-text)',
              cursor: 'pointer',
              transition: 'background 0.2s',
              textAlign: 'left',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
          >
            <span style={{ color: 'var(--flame-muted)' }}>{item.icon}</span>
            <span style={{ flex: 1, fontWeight: '500' }}>{item.label}</span>
            <ChevronRight size={16} style={{ color: 'var(--flame-muted)' }} />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          background: 'rgba(255, 68, 88, 0.08)',
          border: '1px solid rgba(255, 68, 88, 0.2)',
          borderRadius: '16px',
          padding: '16px',
          color: 'var(--flame-primary)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          fontSize: '15px', fontWeight: '600',
          fontFamily: 'Inter, sans-serif',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 68, 88, 0.15)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 68, 88, 0.08)'; }}
      >
        <LogOut size={18} />
        Log Out
      </button>
    </div>
  );
}
