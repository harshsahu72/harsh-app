import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, X, Star, RefreshCw, SlidersHorizontal, MapPin, Briefcase, ShieldCheck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import MatchModal from '../components/MatchModal';
import { useAuthStore } from '../store/authStore';

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=800&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=800&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop&crop=face',
];

function ProfileCard({ user, onSwipeLeft, onSwipeRight, isTop, style = {} }) {
  const cardRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [swipeDir, setSwipeDir] = useState(null);

  const photos = user.photos?.length > 0 ? user.photos : [DEMO_PHOTOS[Math.floor(Math.random() * DEMO_PHOTOS.length)]];

  const handleMouseDown = useCallback((e) => {
    if (!isTop) return;
    isDragging.current = true;
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    startY.current = e.clientY || e.touches?.[0]?.clientY || 0;
    if (cardRef.current) {
      cardRef.current.style.transition = 'none';
    }
  }, [isTop]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current || !isTop) return;
    const x = (e.clientX || e.touches?.[0]?.clientX || 0);
    const deltaX = x - startX.current;
    currentX.current = deltaX;
    const rotate = deltaX * 0.1;

    if (cardRef.current) {
      cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    }

    if (deltaX > 50) setSwipeDir('right');
    else if (deltaX < -50) setSwipeDir('left');
    else setSwipeDir(null);
  }, [isTop]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current || !isTop) return;
    isDragging.current = false;

    if (cardRef.current) {
      cardRef.current.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    if (currentX.current > 80) {
      // Swipe right - like
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(150%) rotate(30deg)';
      }
      setTimeout(() => onSwipeRight(user._id), 400);
    } else if (currentX.current < -80) {
      // Swipe left - dislike
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(-150%) rotate(-30deg)';
      }
      setTimeout(() => onSwipeLeft(user._id), 400);
    } else {
      // Snap back
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateX(0) rotate(0deg)';
      }
      setSwipeDir(null);
    }
    currentX.current = 0;
  }, [isTop, user._id, onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: true });
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={cardRef}
      className="profile-card card-enter"
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '420px',
        height: '100%',
        cursor: isTop ? 'grab' : 'default',
        userSelect: 'none',
        transition: 'all 0.3s ease',
        ...style,
      }}
    >
      {/* Photo */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <img
          src={photos[currentPhoto]}
          alt={user.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
          draggable={false}
          onError={(e) => { e.target.src = DEMO_PHOTOS[0]; }}
        />

        {/* Photo nav dots */}
        {photos.length > 1 && (
          <div style={{
            position: 'absolute', top: '12px', left: '12px', right: '12px',
            display: 'flex', gap: '4px',
          }}>
            {photos.map((_, i) => (
              <div
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentPhoto(i); }}
                style={{
                  flex: 1, height: '3px',
                  borderRadius: '2px',
                  background: i === currentPhoto ? 'white' : 'rgba(255,255,255,0.4)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </div>
        )}

        {/* Photo tap areas */}
        {photos.length > 1 && (
          <>
            <div
              style={{ position: 'absolute', left: 0, top: 0, width: '40%', height: '100%', cursor: 'pointer', zIndex: 2 }}
              onClick={(e) => { e.stopPropagation(); if (isDragging.current) return; setCurrentPhoto(p => Math.max(0, p - 1)); }}
            />
            <div
              style={{ position: 'absolute', right: 0, top: 0, width: '40%', height: '100%', cursor: 'pointer', zIndex: 2 }}
              onClick={(e) => { e.stopPropagation(); if (isDragging.current) return; setCurrentPhoto(p => Math.min(photos.length - 1, p + 1)); }}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
          borderRadius: '0 0 24px 24px',
        }} />

        {/* Swipe labels */}
        {swipeDir === 'right' && (
          <div className="swipe-label-like" style={{ opacity: Math.min(1, Math.abs(currentX.current) / 100) }}>
            LIKE
          </div>
        )}
        {swipeDir === 'left' && (
          <div className="swipe-label-nope" style={{ opacity: Math.min(1, Math.abs(currentX.current) / 100) }}>
            NOPE
          </div>
        )}

        {/* User Info */}
        <div style={{
          position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 3,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'white', lineHeight: '1.2' }}>
                {user.name}, <span style={{ fontWeight: '400' }}>{user.age}</span>
              </h2>
              {user.location?.city && (
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  <MapPin size={13} />
                  {user.location.city}{user.location.country ? `, ${user.location.country}` : ''}
                </p>
              )}
            </div>
          </div>

          {user.bio && (
            <p style={{
              color: 'rgba(255,255,255,0.85)', fontSize: '14px',
              marginTop: '8px', lineHeight: '1.5',
              display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {user.bio}
            </p>
          )}

          {/* Interests */}
          {user.interests?.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
              {user.interests.slice(0, 4).map(interest => (
                <span key={interest} style={{
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '500',
                }}>
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { user, updateUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ ageMin: 18, ageMax: 50, gender: '' });
  const [noMore, setNoMore] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      // Mock payment simulation
      const { data } = await api.post('/users/verify', { paymentToken: 'mock-payment-success' });
      updateUser(data.user);
      toast.success(data.message);
      fetchUsers();
    } catch (err) {
      toast.error('Payment failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const fetchUsers = async (reset = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        ageMin: filters.ageMin,
        ageMax: filters.ageMax,
        ...(filters.gender && { gender: filters.gender }),
      });
      const { data } = await api.get(`/users/discover?${params}`);
      setUsers(data.users);
      setCurrentIndex(0);
      setNoMore(data.users.length === 0);
    } catch (err) {
      toast.error('Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const isTrialActive = user?.trialExpiresAt && new Date() < new Date(user.trialExpiresAt);
    const isSubscriptionActive = user?.subscriptionExpiresAt && new Date() < new Date(user.subscriptionExpiresAt);
    
    if (user?.isVerified || isTrialActive || isSubscriptionActive) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, [user?.isVerified, user?.trialExpiresAt, user?.subscriptionExpiresAt]);

  const handleLike = async (userId) => {
    try {
      const { data } = await api.post(`/users/like/${userId}`);
      if (data.isMatch) {
        setMatchData(data);
      } else {
        toast('💛 Liked!', { icon: '❤️' });
      }
      advanceCard();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDislike = async (userId) => {
    try {
      await api.post(`/users/dislike/${userId}`);
      advanceCard();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleSuperLike = async (userId) => {
    toast('⭐ Super Liked!', { icon: '⭐' });
    await handleLike(userId);
  };

  const advanceCard = () => {
    setCurrentIndex(prev => {
      if (prev + 1 >= users.length) {
        setNoMore(true);
        return prev;
      }
      return prev + 1;
    });
  };

  const visibleUsers = users.slice(currentIndex, currentIndex + 3);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 'calc(100vh - 70px)',
        gap: '20px',
      }}>
        <div style={{
          width: '60px', height: '60px',
          border: '3px solid rgba(255, 68, 88, 0.2)',
          borderTop: '3px solid var(--flame-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <p style={{ color: 'var(--flame-muted)' }}>Finding people near you...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isTrialActive = user?.trialExpiresAt && new Date() < new Date(user.trialExpiresAt);
  const isSubscriptionActive = user?.subscriptionExpiresAt && new Date() < new Date(user.subscriptionExpiresAt);
  const isAccessAllowed = isTrialActive || isSubscriptionActive || user?.isVerified;

  if (!isAccessAllowed) {
    const trialDate = user?.trialExpiresAt ? new Date(user.trialExpiresAt).toLocaleString() : 'N/A';
    
    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: 'calc(100vh - 70px)',
        padding: '24px', textAlign: 'center'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255, 68, 88, 0.1)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: '24px'
        }}>
          <ShieldCheck size={40} color="#FF4458" />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '16px' }}>
          Free Trial Expired
        </h2>
        <p style={{ color: 'var(--flame-muted)', fontSize: '16px', maxWidth: '400px', lineHeight: '1.6', marginBottom: '32px' }}>
          Your 24-hour free trial ended on <strong>{trialDate}</strong>. Subscribe now to continue finding your match and chatting with original accounts.
        </p>
        <div className="glass" style={{ padding: '32px', borderRadius: '24px', maxWidth: '380px', width: '100%', marginBottom: '32px', border: '1px solid var(--aurora-primary)' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--aurora-primary)', borderRadius: '100px', fontSize: '11px', fontWeight: '700', color: 'white', marginBottom: '16px' }}>POPULAR</div>
          <div style={{ fontSize: '42px', fontWeight: '900', color: 'white', marginBottom: '4px' }}>499</div>
          <div style={{ color: 'var(--flame-muted)', fontSize: '14px', marginBottom: '24px' }}>per month</div>
          
          <ul style={{ textAlign: 'left', listStyle: 'none', padding: 0, marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {['Unlimited Swipes', 'Global Discovery', 'Advanced Psychometric Matching', 'Verified Badge'].map(feat => (
              <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#00D26A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={10} color="white" fill="white" />
                </div>
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '16px' }}
          >
            {isVerifying ? 'Processing...' : 'Subscribe for 499/mo'}
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', maxWidth: '300px' }}>
          Secure payment via Stripe. Cancel anytime. By subscribing, you agree to our Terms of Service.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: '24px 16px',
      minHeight: 'calc(100vh - 70px)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', maxWidth: '480px', marginBottom: '16px',
      }}>
        <div>
          <h2 style={{ fontSize: 'clamp(18px, 5vw, 22px)', fontWeight: '700' }}>Discover</h2>
          <p style={{ color: 'var(--flame-muted)', fontSize: '12px', marginTop: '2px' }}>
            {noMore ? 'No more profiles' : `${users.length - currentIndex} profiles left`}
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            background: showFilters ? 'var(--flame-gradient)' : 'rgba(255,255,255,0.05)',
            border: showFilters ? 'none' : '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '8px 14px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '500',
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="glass" style={{
          width: '100%', maxWidth: '480px',
          borderRadius: '16px', padding: '20px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Filter Profiles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: 'var(--flame-muted)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Age range: {filters.ageMin} - {filters.ageMax}
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="range" min="18" max="60" value={filters.ageMin}
                  onChange={e => setFilters({...filters, ageMin: parseInt(e.target.value)})}
                  style={{ flex: 1, accentColor: 'var(--flame-primary)' }}
                />
                <input type="range" min="20" max="100" value={filters.ageMax}
                  onChange={e => setFilters({...filters, ageMax: parseInt(e.target.value)})}
                  style={{ flex: 1, accentColor: 'var(--flame-primary)' }}
                />
              </div>
            </div>
            <div>
              <label style={{ color: 'var(--flame-muted)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                Show me
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['', 'male', 'female', 'non-binary'].map(g => (
                  <button
                    key={g}
                    onClick={() => setFilters({...filters, gender: g})}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '50px',
                      border: filters.gender === g ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      background: filters.gender === g ? 'var(--flame-gradient)' : 'transparent',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    {g === '' ? 'Everyone' : g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary" onClick={() => { fetchUsers(true); setShowFilters(false); }}
              style={{ width: '100%', padding: '12px' }}>
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Card Stack */}
      {!noMore ? (
        <>
          <div style={{
            position: 'relative',
            width: '100%', 
            maxWidth: '420px',
            flex: 1,
            maxHeight: 'min(580px, 70vh)',
            marginBottom: '24px',
            zIndex: 10,
          }}>
            {visibleUsers.map((user, i) => (
              <ProfileCard
                key={user._id}
                user={user}
                isTop={i === 0}
                onSwipeLeft={handleDislike}
                onSwipeRight={handleLike}
                style={{
                  zIndex: visibleUsers.length - i,
                  transform: i === 0 ? 'none' : `scale(${1 - i * 0.04}) translateY(${i * -16}px)`,
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex', gap: '20px', alignItems: 'center',
            justifyContent: 'center', marginTop: '8px',
          }}>
            {/* Dislike */}
            <button
              onClick={() => visibleUsers[0] && handleDislike(visibleUsers[0]._id)}
              style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 68, 88, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#FF4458',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 68, 88, 0.15)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <X size={28} />
            </button>

            {/* Super Like */}
            <button
              onClick={() => visibleUsers[0] && handleSuperLike(visibleUsers[0]._id)}
              style={{
                width: '52px', height: '52px',
                borderRadius: '50%',
                background: 'rgba(255, 193, 7, 0.1)',
                border: '2px solid rgba(255, 193, 7, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                color: '#FFC107',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255, 193, 7, 0.2)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255, 193, 7, 0.1)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Star size={22} />
            </button>

            {/* Like */}
            <button
              onClick={() => visibleUsers[0] && handleLike(visibleUsers[0]._id)}
              style={{
                width: '64px', height: '64px',
                borderRadius: '50%',
                background: 'var(--flame-gradient)',
                border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 20px rgba(255, 68, 88, 0.5)',
                color: 'white',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 68, 88, 0.7)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 68, 88, 0.5)';
              }}
            >
              <Heart size={28} fill="white" />
            </button>
          </div>
        </>
      ) : (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: '20px', padding: '60px 24px',
          textAlign: 'center',
        }}>
          <div className="animate-heartbeat" style={{ fontSize: '80px' }}>🔥</div>
          <h2 style={{ fontSize: '24px', fontWeight: '700' }}>You've seen everyone!</h2>
          <p style={{ color: 'var(--flame-muted)', fontSize: '15px', maxWidth: '300px', lineHeight: '1.6' }}>
            No more profiles for now. Check back later or adjust your filters.
          </p>
          <button
            className="btn-primary"
            onClick={() => fetchUsers(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px' }}
          >
            <RefreshCw size={16} />
            Refresh Profiles
          </button>
        </div>
      )}

      {/* Match Modal */}
      {matchData && (
        <MatchModal
          matchData={matchData}
          onClose={() => setMatchData(null)}
        />
      )}
    </div>
  );
}
