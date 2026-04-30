import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Heart, MoreVertical } from 'lucide-react';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { getSocket, connectSocket } from '../utils/socket';
import toast from 'react-hot-toast';

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
];

function MessageBubble({ msg, isOwn }) {
  const time = new Date(msg.timestamp || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{
      display: 'flex',
      justifyContent: isOwn ? 'flex-end' : 'flex-start',
      marginBottom: '6px',
    }}>
      <div style={{ maxWidth: '75%' }}>
        <div className={isOwn ? 'message-bubble-sent' : 'message-bubble-received'}>
          {msg.content}
        </div>
        <div style={{
          fontSize: '11px', color: 'var(--flame-muted)',
          marginTop: '4px',
          textAlign: isOwn ? 'right' : 'left',
          paddingLeft: isOwn ? 0 : '4px',
          paddingRight: isOwn ? '4px' : 0,
        }}>
          {time}
          {isOwn && msg.isRead && ' · Read'}
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { conversationId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const loadChat = async () => {
      try {
        // Load messages
        const { data: msgData } = await api.get(`/messages/${conversationId}`);
        setMessages(msgData.messages);

        // Load match info (to get the other user)
        const { data: matchData } = await api.get(`/matches/${conversationId}`);
        if (matchData.match) {
          const other = matchData.match.users.find(u => u._id !== user._id);
          setOtherUser(other);
        }
      } catch (err) {
        toast.error('Failed to load chat');
      } finally {
        setIsLoading(false);
      }
    };

    loadChat();

    // Socket setup
    const socket = connectSocket(user._id);
    socket.emit('join_room', conversationId);

    socket.on('receive_message', (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    socket.on('user_typing', ({ userId }) => {
      if (userId !== user._id) setIsTyping(true);
    });

    socket.on('user_stop_typing', ({ userId }) => {
      if (userId !== user._id) setIsTyping(false);
    });

    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
      socket.off('user_stop_typing');
    };
  }, [conversationId, user._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setNewMsg(e.target.value);

    // Emit typing
    const socket = getSocket();
    socket.emit('typing', { roomId: conversationId, userId: user._id });

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => {
      socket.emit('stop_typing', { roomId: conversationId, userId: user._id });
    }, 1500));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const msg = newMsg.trim();
    if (!msg) return;

    setNewMsg('');

    // Optimistic update
    const optimisticMsg = {
      _id: Date.now(),
      conversationId,
      sender: { _id: user._id, name: user.name },
      receiver: { _id: otherUser?._id },
      content: msg,
      timestamp: new Date(),
      isRead: false,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    // Send via socket
    const socket = getSocket();
    socket.emit('send_message', {
      roomId: conversationId,
      senderId: user._id,
      receiverId: otherUser?._id,
      message: msg,
      timestamp: new Date(),
    });

    // Stop typing
    socket.emit('stop_typing', { roomId: conversationId, userId: user._id });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSend(e);
    }
  };

  const otherPhoto = otherUser?.photos?.[0] || DEMO_PHOTOS[1];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100vh - 70px)',
      maxWidth: '700px', margin: '0 auto',
      width: '100%',
    }}>
      {/* Chat Header */}
      <div className="glass-dark" style={{
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '14px',
        borderBottom: '1px solid var(--flame-border)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate('/matches')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--flame-muted)', padding: '4px',
            display: 'flex', alignItems: 'center',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--flame-muted)'; }}
        >
          <ArrowLeft size={22} />
        </button>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <img
            src={otherPhoto}
            alt={otherUser?.name}
            style={{
              width: '44px', height: '44px', borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--flame-primary)',
            }}
            onError={e => { e.target.src = DEMO_PHOTOS[1]; }}
          />
          <div style={{
            position: 'absolute', bottom: '1px', right: '1px',
            width: '11px', height: '11px', borderRadius: '50%',
            background: '#00D26A',
            border: '2px solid var(--flame-dark)',
          }} />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '15px' }}>
            {otherUser?.name || 'Loading...'}
            {otherUser?.age && (
              <span style={{ fontWeight: '400', color: 'var(--flame-muted)', marginLeft: '6px' }}>
                {otherUser.age}
              </span>
            )}
          </div>
          {isTyping ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--flame-primary)', fontSize: '12px', fontWeight: '500' }}>typing</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '5px', height: '5px', borderRadius: '50%',
                    background: 'var(--flame-primary)',
                    animation: `bounce 0.8s ${i * 0.15}s ease-in-out infinite alternate`,
                  }} />
                ))}
              </div>
              <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-5px); } }`}</style>
            </div>
          ) : (
            <div style={{ color: '#00D26A', fontSize: '12px', fontWeight: '500' }}>Online</div>
          )}
        </div>

        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--flame-muted)', padding: '4px',
        }}>
          <Heart size={20} />
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 16px',
        display: 'flex', flexDirection: 'column',
      }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <div style={{
              width: '36px', height: '36px',
              border: '2px solid rgba(255, 68, 88, 0.2)',
              borderTop: '2px solid var(--flame-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : messages.length === 0 ? (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '12px',
            padding: '40px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '60px' }}>💬</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Start the conversation!</h3>
            <p style={{ color: 'var(--flame-muted)', fontSize: '14px', maxWidth: '240px', lineHeight: '1.6' }}>
              You matched with {otherUser?.name}. Send them a message 🔥
            </p>
          </div>
        ) : (
          <>
            {/* Match notification */}
            <div style={{
              textAlign: 'center', marginBottom: '20px', padding: '12px',
            }}>
              <span style={{
                background: 'rgba(255, 68, 88, 0.1)',
                border: '1px solid rgba(255, 68, 88, 0.2)',
                borderRadius: '20px', padding: '8px 16px',
                fontSize: '13px', color: 'var(--flame-muted)',
              }}>
                🔥 You matched! Start the conversation
              </span>
            </div>

            {messages.map((msg, i) => {
              const isOwn = msg.sender?._id === user._id || msg.sender === user._id;
              return <MessageBubble key={msg._id || i} msg={msg} isOwn={isOwn} />;
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="glass-dark" style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--flame-border)',
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <input
            ref={inputRef}
            type="text"
            value={newMsg}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${otherUser?.name || ''}...`}
            className="input-field"
            style={{
              flex: 1,
              borderRadius: '22px',
              padding: '12px 18px',
              fontSize: '14px',
              resize: 'none',
            }}
          />
          <button
            type="submit"
            disabled={!newMsg.trim()}
            style={{
              width: '48px', height: '48px',
              borderRadius: '50%',
              background: newMsg.trim() ? 'var(--flame-gradient)' : 'rgba(255,255,255,0.08)',
              border: 'none',
              cursor: newMsg.trim() ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white',
              transition: 'all 0.2s ease',
              flexShrink: 0,
              boxShadow: newMsg.trim() ? '0 4px 15px rgba(255, 68, 88, 0.4)' : 'none',
            }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
