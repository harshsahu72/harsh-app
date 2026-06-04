import { create } from 'zustand';

/**
 * Global call state store.
 * callState: 'idle' | 'calling' | 'incoming' | 'active'
 * callType:  'voice' | 'video'
 */
export const useCallStore = create((set) => ({
  callState: 'idle',
  callType: null,
  remoteUser: null,
  incomingOffer: null,

  // Injected by CallManager on mount so ChatPage can trigger calls
  initiateCall: null,

  // ── Setters ───────────────────────────────────────────────────────
  setCallState: (state) => set({ callState: state }),
  setCallType: (type) => set({ callType: type }),
  setRemoteUser: (user) => set({ remoteUser: user }),
  setIncomingOffer: (offer) => set({ incomingOffer: offer }),
  setInitiateCall: (fn) => set({ initiateCall: fn }),

  reset: () =>
    set({
      callState: 'idle',
      callType: null,
      remoteUser: null,
      incomingOffer: null,
    }),
}));
