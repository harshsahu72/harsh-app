import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Flame, Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../utils/socket';
import CallManager from './CallManager';
import toast from 'react-hot-toast';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      const socket = connectSocket(user._id);

      // Listen for new match notifications
      socket.on('receive_message', (data) => {
        // handled in chat page
      });
    }

    return () => {
      disconnectSocket();
    };
  }, [user?._id]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out. See you soon! 👋');
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--flame-dark)' }}>
      {/* Top Bar */}
      <header className="glass-dark" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--flame-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'var(--flame-gradient)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Flame size={20} color="white" />
          </div>
          <span className="gradient-text" style={{ fontWeight: '800', fontSize: '20px', fontFamily: 'Playfair Display, serif' }}>
            Flamr
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="desktop-only" style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <NavLink to="/discover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Flame size={20} />
            <span>Discover</span>
          </NavLink>
          <NavLink to="/matches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <Heart size={20} />
            <span>Matches</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: 'rgba(255, 68, 88, 0.1)',
            border: '1px solid rgba(255, 68, 88, 0.2)',
            borderRadius: '10px',
            padding: '8px 12px',
            color: 'var(--flame-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
          }}
        >
          <LogOut size={15} />
          <span className="desktop-only">Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px))' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-only bottom-nav">
        <NavLink to="/discover" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Flame size={22} />
          <span>Discover</span>
        </NavLink>
        <NavLink to="/matches" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Heart size={22} />
          <span>Matches</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={22} />
          <span>Profile</span>
        </NavLink>
      </nav>

      {/* Global call overlay — renders IncomingCallModal or CallScreen */}
      <CallManager />
    </div>
  );
}
