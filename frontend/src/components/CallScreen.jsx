import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Mic, MicOff, Video, VideoOff, Phone,
  Volume2, Volume1,
} from 'lucide-react';

const DEMO_PHOTO =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face';

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function CallScreen({
  callState,
  callType,
  remoteUser,
  localStream,
  remoteStream,
  isMuted,
  isCameraOff,
  onToggleMute,
  onToggleCamera,
  onEndCall,
}) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const hideTimerRef = useRef(null);
  const photo = remoteUser?.photos?.[0] || DEMO_PHOTO;

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call duration timer (only counts when active)
  useEffect(() => {
    if (callState !== 'active') return;
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  // Auto-hide controls after 4s of no interaction
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setShowControls(false), 4000);
  }, []);

  useEffect(() => {
    if (callType === 'video') resetHideTimer();
    return () => clearTimeout(hideTimerRef.current);
  }, [callType, resetHideTimer]);

  const isVideo = callType === 'video';
  const isConnecting = callState === 'calling';

  return (
    <div
      id="call-screen"
      onClick={isVideo ? resetHideTimer : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: isVideo ? '#000' : 'var(--aurora-bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Video: Remote stream fills background ── */}
      {isVideo && (
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* ── Voice call: Large avatar + wave animation ── */}
      {!isVideo && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            backgroundImage:
              'radial-gradient(ellipse at 50% 30%, rgba(124,58,237,0.18) 0%, transparent 70%)',
          }}
        >
          {/* Pulsing avatar */}
          <div style={{ position: 'relative' }}>
            {!isConnecting && (
              <>
                <div className="voice-ring voice-ring-1" />
                <div className="voice-ring voice-ring-2" />
              </>
            )}
            <img
              src={photo}
              alt={remoteUser?.name}
              onError={(e) => { e.target.src = DEMO_PHOTO; }}
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid rgba(124, 58, 237, 0.6)',
                boxShadow: '0 0 50px rgba(124, 58, 237, 0.4)',
                position: 'relative',
                zIndex: 2,
              }}
            />
          </div>

          {/* Name + status */}
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>
              {remoteUser?.name || 'Unknown'}
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: isConnecting ? 'var(--aurora-muted)' : '#00D26A',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              {isConnecting ? (
                <>
                  <span className="calling-dots">Calling</span>
                </>
              ) : (
                <>
                  <span style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: '#00D26A', display: 'inline-block',
                    animation: 'pulse-green 2s ease-in-out infinite',
                  }} />
                  {formatDuration(duration)}
                </>
              )}
            </p>
          </div>

          {/* Audio wave bars */}
          {!isConnecting && (
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', height: '40px' }}>
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="audio-bar"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Video: PiP local video ── */}
      {isVideo && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '120px',
            height: '160px',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.3)',
            background: '#111',
            zIndex: 10,
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)',
          }}
        >
          {isCameraOff ? (
            <div style={{
              width: '100%', height: '100%', background: '#111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.4)', fontSize: '12px',
            }}>
              Camera off
            </div>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            />
          )}
        </div>
      )}

      {/* ── Video: name + timer overlay (top-left) ── */}
      {isVideo && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10,
            transition: 'opacity 0.4s',
            opacity: showControls ? 1 : 0,
          }}
        >
          <div style={{
            fontWeight: '700', fontSize: '18px', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}>
            {remoteUser?.name}
          </div>
          <div style={{ color: '#00D26A', fontSize: '13px', fontWeight: '500', marginTop: '2px' }}>
            {isConnecting ? 'Connecting…' : formatDuration(duration)}
          </div>
        </div>
      )}

      {/* ── Controls bar ── */}
      <div
        style={{
          position: isVideo ? 'absolute' : 'relative',
          bottom: isVideo ? '32px' : undefined,
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          padding: '24px',
          transition: isVideo ? 'opacity 0.4s' : undefined,
          opacity: isVideo ? (showControls ? 1 : 0) : 1,
          pointerEvents: isVideo ? (showControls ? 'auto' : 'none') : 'auto',
          background: isVideo
            ? 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
            : 'transparent',
        }}
      >
        {/* Mute */}
        <CallControlBtn
          id="btn-mute"
          onClick={onToggleMute}
          active={isMuted}
          activeColor="#FF4458"
          label={isMuted ? 'Unmute' : 'Mute'}
          icon={isMuted ? <MicOff size={22} /> : <Mic size={22} />}
        />

        {/* Camera (video only) */}
        {isVideo && (
          <CallControlBtn
            id="btn-camera"
            onClick={onToggleCamera}
            active={isCameraOff}
            activeColor="#FF4458"
            label={isCameraOff ? 'Camera On' : 'Camera Off'}
            icon={isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
          />
        )}

        {/* Speaker toggle */}
        <CallControlBtn
          id="btn-speaker"
          onClick={() => setIsSpeakerOn((s) => !s)}
          active={!isSpeakerOn}
          activeColor="#FF4458"
          label={isSpeakerOn ? 'Speaker' : 'Earpiece'}
          icon={isSpeakerOn ? <Volume2 size={22} /> : <Volume1 size={22} />}
        />

        {/* End call */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <button
            id="btn-end-call"
            onClick={onEndCall}
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FF4458, #FF6B35)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(255, 68, 88, 0.5)',
              color: 'white',
              transition: 'all 0.2s ease',
              transform: 'rotate(135deg)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'rotate(135deg) scale(1.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'rotate(135deg)'; }}
          >
            <Phone size={26} />
          </button>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '500' }}>End</span>
        </div>
      </div>
    </div>
  );
}

function CallControlBtn({ id, onClick, active, activeColor, label, icon }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
      <button
        id={id}
        onClick={onClick}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: active ? `${activeColor}22` : 'rgba(255,255,255,0.12)',
          border: active ? `2px solid ${activeColor}` : '2px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: active ? activeColor : 'white',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = active ? `${activeColor}33` : 'rgba(255,255,255,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = active ? `${activeColor}22` : 'rgba(255,255,255,0.12)'; }}
      >
        {icon}
      </button>
      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '500' }}>{label}</span>
    </div>
  );
}
