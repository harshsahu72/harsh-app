import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Camera, X, Plus, Save, MapPin, User,
  Calendar, FileText, Heart
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ALL_INTERESTS = [
  'Travel', 'Music', 'Fitness', 'Photography', 'Cooking', 'Reading',
  'Gaming', 'Hiking', 'Art', 'Movies', 'Dancing', 'Yoga',
  'Coffee', 'Dogs', 'Cats', 'Technology', 'Fashion', 'Sports',
  'Wine', 'Meditation', 'Surfing', 'Camping', 'Theatre', 'Foodie',
];

const GENDERS = ['male', 'female', 'non-binary', 'other'];
const INTEREST_IN = [
  { value: 'male', label: 'Men' },
  { value: 'female', label: 'Women' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'everyone', label: 'Everyone' },
];

const DEMO_PHOTOS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop&crop=face',
];

export default function EditProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    bio: user?.bio || '',
    interests: user?.interests || [],
    photos: user?.photos || [],
    location: user?.location || { city: '', country: '' },
    interestedIn: user?.interestedIn || ['everyone'],
    preferences: user?.preferences || { ageMin: 18, ageMax: 50 },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      location: { ...prev.location, [field]: value },
    }));
  };

  const toggleInterest = (interest) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest].slice(0, 8),
    }));
  };

  const toggleInterestedIn = (value) => {
    setForm(prev => ({
      ...prev,
      interestedIn: prev.interestedIn.includes(value)
        ? prev.interestedIn.filter(i => i !== value)
        : [...prev.interestedIn, value],
    }));
  };

  // Simulate photo upload (base64 demo)
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({
        ...prev,
        photos: [...prev.photos, ev.target.result].slice(0, 6),
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx) => {
    setForm(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.age) {
      toast.error('Name and age are required');
      return;
    }
    setIsSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data.user);
      toast.success('Profile updated! ✨');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: <User size={16} /> },
    { id: 'photos', label: 'Photos', icon: <Camera size={16} /> },
    { id: 'interests', label: 'Interests', icon: <Heart size={16} /> },
    { id: 'preferences', label: 'Preferences', icon: <MapPin size={16} /> },
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '28px',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800' }}>Edit Profile</h1>
          <p style={{ color: 'var(--flame-muted)', fontSize: '14px', marginTop: '2px' }}>
            Make your profile shine ✨
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn-primary"
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '12px 22px', fontSize: '14px',
            opacity: isSaving ? 0.7 : 1,
          }}
        >
          <Save size={15} />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Section Tabs */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '24px',
        overflowX: 'auto', paddingBottom: '4px',
      }}>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '50px', whiteSpace: 'nowrap',
              border: activeSection === s.id ? 'none' : '1px solid rgba(255,255,255,0.12)',
              background: activeSection === s.id ? 'var(--flame-gradient)' : 'transparent',
              color: activeSection === s.id ? 'white' : 'var(--flame-muted)',
              cursor: 'pointer', fontSize: '13px', fontWeight: '500',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s ease',
            }}
          >
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                <User size={13} style={{ display: 'inline', marginRight: '5px' }} />
                First Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder="Your name"
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                <Calendar size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Age *
              </label>
              <input
                type="number"
                value={form.age}
                onChange={e => handleChange('age', e.target.value)}
                placeholder="Your age"
                min="18"
                max="100"
                className="input-field"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '10px', fontWeight: '500' }}>
                Gender *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {GENDERS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => handleChange('gender', g)}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: form.gender === g ? '2px solid var(--flame-primary)' : '1.5px solid rgba(255,255,255,0.1)',
                      background: form.gender === g ? 'rgba(255, 68, 88, 0.1)' : 'rgba(255,255,255,0.03)',
                      color: form.gender === g ? 'var(--flame-primary)' : 'var(--flame-muted)',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: form.gender === g ? '600' : '400',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                <FileText size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Bio (max 500 chars)
              </label>
              <textarea
                value={form.bio}
                onChange={e => handleChange('bio', e.target.value)}
                placeholder="Tell people about yourself..."
                maxLength={500}
                rows={4}
                className="input-field"
                style={{ resize: 'vertical', lineHeight: '1.6' }}
              />
              <div style={{ textAlign: 'right', color: 'var(--flame-muted)', fontSize: '12px', marginTop: '4px' }}>
                {form.bio.length}/500
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                  <MapPin size={13} style={{ display: 'inline', marginRight: '5px' }} />
                  City
                </label>
                <input
                  type="text"
                  value={form.location.city}
                  onChange={e => handleLocationChange('city', e.target.value)}
                  placeholder="Your city"
                  className="input-field"
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
                  Country
                </label>
                <input
                  type="text"
                  value={form.location.country}
                  onChange={e => handleLocationChange('country', e.target.value)}
                  placeholder="Country"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photos Section */}
      {activeSection === 'photos' && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <p style={{ color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '20px' }}>
            Add up to 6 photos. Your first photo will be your profile photo. 📸
          </p>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            {[...form.photos, ...(form.photos.length < 6 ? ['add'] : [])].slice(0, 6).map((photo, idx) => (
              photo === 'add' ? (
                <label key="add" style={{
                  aspectRatio: '3/4',
                  borderRadius: '16px',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: '8px', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.02)',
                  transition: 'all 0.2s',
                  color: 'var(--flame-muted)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--flame-primary)'; e.currentTarget.style.color = 'var(--flame-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'var(--flame-muted)'; }}
                >
                  <Plus size={24} />
                  <span style={{ fontSize: '12px' }}>Add Photo</span>
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </label>
              ) : (
                <div key={idx} style={{ position: 'relative', aspectRatio: '3/4' }}>
                  <img
                    src={photo}
                    alt={`Photo ${idx + 1}`}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      borderRadius: '16px',
                      border: idx === 0 ? '2px solid var(--flame-primary)' : 'none',
                    }}
                    onError={e => { e.target.src = DEMO_PHOTOS[0]; }}
                  />
                  {idx === 0 && (
                    <div style={{
                      position: 'absolute', top: '8px', left: '8px',
                      background: 'var(--flame-gradient)',
                      borderRadius: '8px', padding: '3px 8px',
                      fontSize: '10px', fontWeight: '700', color: 'white',
                    }}>
                      MAIN
                    </div>
                  )}
                  <button
                    onClick={() => removePhoto(idx)}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      width: '28px', height: '28px',
                      background: 'rgba(0,0,0,0.7)',
                      border: 'none', borderRadius: '50%',
                      cursor: 'pointer', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Interests Section */}
      {activeSection === 'interests' && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <p style={{ color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '6px' }}>
            Select up to 8 interests to show on your profile
          </p>
          <p style={{ color: 'var(--flame-primary)', fontSize: '12px', marginBottom: '20px' }}>
            {form.interests.length}/8 selected
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {ALL_INTERESTS.map(interest => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`chip ${form.interests.includes(interest) ? 'selected' : ''}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preferences Section */}
      {activeSection === 'preferences' && (
        <div className="glass" style={{ borderRadius: '20px', padding: '24px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '12px', fontWeight: '500' }}>
                I'm interested in
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {INTEREST_IN.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => toggleInterestedIn(opt.value)}
                    style={{
                      padding: '9px 20px', borderRadius: '50px',
                      border: form.interestedIn.includes(opt.value)
                        ? 'none' : '1px solid rgba(255,255,255,0.15)',
                      background: form.interestedIn.includes(opt.value)
                        ? 'var(--flame-gradient)' : 'transparent',
                      color: 'white', cursor: 'pointer',
                      fontSize: '14px', fontWeight: '500',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--flame-muted)', fontSize: '13px', marginBottom: '4px', fontWeight: '500' }}>
                Age Range: {form.preferences.ageMin} – {form.preferences.ageMax}
              </label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--flame-muted)', marginBottom: '6px' }}>Min Age</div>
                  <input
                    type="range" min="18" max={form.preferences.ageMax - 1}
                    value={form.preferences.ageMin}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, ageMin: parseInt(e.target.value) },
                    }))}
                    style={{ width: '100%', accentColor: 'var(--flame-primary)' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: 'var(--flame-muted)', marginBottom: '6px' }}>Max Age</div>
                  <input
                    type="range" min={form.preferences.ageMin + 1} max="100"
                    value={form.preferences.ageMax}
                    onChange={e => setForm(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, ageMax: parseInt(e.target.value) },
                    }))}
                    style={{ width: '100%', accentColor: 'var(--flame-primary)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="btn-primary"
        style={{
          width: '100%', marginTop: '20px',
          padding: '16px', fontSize: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          opacity: isSaving ? 0.7 : 1,
        }}
      >
        <Save size={18} />
        {isSaving ? 'Saving Profile...' : 'Save Profile'}
      </button>
    </div>
  );
}
