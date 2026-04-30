import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Flame, Heart, MessageCircle, User, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { connectSocket, disconnectSocket } from '../utils/socket';
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

        {/* Nav */}
        <nav style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
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

        {/* Logout */}
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
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 68, 88, 0.2)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 68, 88, 0.1)';
          }}
        >
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="glass-dark" style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '8px 0',
        borderTop: '1px solid var(--flame-border)',
        zIndex: 50,
        justifyContent: 'space-around',
        '@media (maxWidth: 768px)': { display: 'flex' },
      }}>
      </nav>
    </div>
  );
}
