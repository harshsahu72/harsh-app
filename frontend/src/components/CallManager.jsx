import { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getSocket } from '../utils/socket';
import { useAuthStore } from '../store/authStore';
import { useCallStore } from '../store/callStore';
import IncomingCallModal from './IncomingCallModal';
import CallScreen from './CallScreen';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

/**
 * CallManager — mounted once inside Layout.
 * Owns all WebRTC state (peer connection, media streams) via refs so they
 * don't cause re-renders. Injects `initiateCall` into callStore so ChatPage
 * can trigger calls without coupling to WebRTC internals.
 */
export default function CallManager() {
  const { user } = useAuthStore();
  const {
    callState, callType, remoteUser, incomingOffer,
    setCallState, setCallType, setRemoteUser, setIncomingOffer,
    setInitiateCall, reset,
  } = useCallStore();

  // WebRTC refs — avoid re-renders
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteUserIdRef = useRef(null);

  // State that drives UI
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  // Keep remoteUserId ref in sync so ICE callbacks always have the right id
  useEffect(() => {
    if (remoteUser?._id) remoteUserIdRef.current = remoteUser._id;
  }, [remoteUser]);

  // ── Helpers ─────────────────────────────────────────────────────────

  const getMedia = useCallback(async (type) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video' ? { width: 1280, height: 720, facingMode: 'user' } : false,
    });
    localStreamRef.current = stream;
    setLocalStream(stream);
    return stream;
  }, []);

  const cleanup = useCallback(() => {
    // Stop all media tracks
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.ontrack = null;
      pcRef.current.onicecandidate = null;
      pcRef.current.onconnectionstatechange = null;
      pcRef.current.close();
      pcRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setIsMuted(false);
    setIsCameraOff(false);
    reset();
  }, [reset]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Relay ICE candidates to the other party
    pc.onicecandidate = ({ candidate }) => {
      if (candidate && remoteUserIdRef.current) {
        getSocket().emit('call_ice_candidate', {
          to: remoteUserIdRef.current,
          candidate,
        });
      }
    };

    // Receive remote media stream
    pc.ontrack = ({ streams }) => {
      if (streams?.[0]) setRemoteStream(streams[0]);
    };

    // Auto-cleanup on unexpected disconnect
    pc.onconnectionstatechange = () => {
      const bad = ['disconnected', 'failed', 'closed'];
      if (bad.includes(pc.connectionState)) {
        cleanup();
      }
    };

    pcRef.current = pc;
    return pc;
  }, [cleanup]);

  // ── Public API ───────────────────────────────────────────────────────

  /** Called from ChatPage when the user clicks 📞 or 📹 */
  const initiateCall = useCallback(
    async (type, targetUser) => {
      try {
        setCallType(type);
        setRemoteUser(targetUser);
        setCallState('calling');
        remoteUserIdRef.current = targetUser._id;

        const stream = await getMedia(type);
        const pc = createPeerConnection();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        getSocket().emit('call_offer', {
          to: targetUser._id,
          from: { _id: user._id, name: user.name, photos: user.photos || [] },
          callType: type,
          offer,
        });
      } catch (err) {
        console.error('Call initiation failed:', err);
        toast.error(err.name === 'NotAllowedError'
          ? 'Camera/microphone permission denied.' 
          : 'Failed to start call.');
        cleanup();
      }
    },
    [user, getMedia, createPeerConnection, cleanup, setCallType, setRemoteUser, setCallState],
  );

  /** Called when the callee clicks Accept */
  const acceptCall = useCallback(async () => {
    try {
      setCallState('active');

      const stream = await getMedia(callType);
      const pc = createPeerConnection();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(new RTCSessionDescription(incomingOffer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      getSocket().emit('call_answer', { to: remoteUserIdRef.current, answer });
    } catch (err) {
      console.error('Accept call failed:', err);
      toast.error(err.name === 'NotAllowedError'
        ? 'Camera/microphone permission denied.'
        : 'Failed to accept call.');
      cleanup();
    }
  }, [callType, incomingOffer, getMedia, createPeerConnection, cleanup, setCallState]);

  /** Called when the callee clicks Reject */
  const rejectCall = useCallback(() => {
    getSocket().emit('call_reject', { to: remoteUserIdRef.current });
    cleanup();
  }, [cleanup]);

  /** Called when either party clicks End Call */
  const endCall = useCallback(() => {
    if (remoteUserIdRef.current) {
      getSocket().emit('call_end', { to: remoteUserIdRef.current });
    }
    cleanup();
  }, [cleanup]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((prev) => !prev);
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsCameraOff((prev) => !prev);
  }, []);

  // ── Inject initiateCall into the store so ChatPage can call it ───────
  useEffect(() => {
    setInitiateCall(initiateCall);
  }, [initiateCall, setInitiateCall]);

  // ── Socket listeners ─────────────────────────────────────────────────
  useEffect(() => {
    if (!user?._id) return;
    const socket = getSocket();

    const onIncomingCall = ({ from, offer, callType: type }) => {
      remoteUserIdRef.current = from._id;
      setRemoteUser(from);
      setCallType(type);
      setIncomingOffer(offer);
      setCallState('incoming');
    };

    const onCallAnswered = async ({ answer }) => {
      if (!pcRef.current) return;
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState('active');
      } catch (err) {
        console.error('setRemoteDescription failed:', err);
      }
    };

    const onIceCandidate = async ({ candidate }) => {
      if (!pcRef.current || !candidate) return;
      try {
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        // Non-fatal; stale candidates during renegotiation
        console.warn('addIceCandidate error (non-fatal):', err.message);
      }
    };

    const onCallRejected = () => {
      toast('Call declined 📵', { icon: '📵' });
      cleanup();
    };

    const onCallEnded = () => {
      toast('Call ended', { icon: '📞' });
      cleanup();
    };

    const onCallFailed = ({ reason }) => {
      toast.error(reason || 'Call failed');
      cleanup();
    };

    socket.on('incoming_call', onIncomingCall);
    socket.on('call_answered', onCallAnswered);
    socket.on('ice_candidate', onIceCandidate);
    socket.on('call_rejected', onCallRejected);
    socket.on('call_ended', onCallEnded);
    socket.on('call_failed', onCallFailed);

    return () => {
      socket.off('incoming_call', onIncomingCall);
      socket.off('call_answered', onCallAnswered);
      socket.off('ice_candidate', onIceCandidate);
      socket.off('call_rejected', onCallRejected);
      socket.off('call_ended', onCallEnded);
      socket.off('call_failed', onCallFailed);
    };
  }, [user?._id, cleanup, setRemoteUser, setCallType, setIncomingOffer, setCallState]);

  // ── Render ───────────────────────────────────────────────────────────
  if (callState === 'idle') return null;

  if (callState === 'incoming') {
    return (
      <IncomingCallModal
        remoteUser={remoteUser}
        callType={callType}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
    );
  }

  return (
    <CallScreen
      callState={callState}
      callType={callType}
      remoteUser={remoteUser}
      localStream={localStream}
      remoteStream={remoteStream}
      isMuted={isMuted}
      isCameraOff={isCameraOff}
      onToggleMute={toggleMute}
      onToggleCamera={toggleCamera}
      onEndCall={endCall}
    />
  );
}
