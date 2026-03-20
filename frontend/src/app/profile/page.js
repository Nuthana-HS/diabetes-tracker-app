'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Settings, Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile } from '@/services/api';

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
    });

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const parsed = JSON.parse(userStr);
            setUser(parsed);
            setFormData({
                name: parsed.name || '',
                phone: parsed.phone || '',
            });
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateProfile({ name: formData.name, phone: formData.phone });
            const updatedUser = { ...user, ...res };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error?.error || error?.errors?.[0] || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    const inp = {
        width: '100%', padding: '12px 14px', border: '1.5px solid #e2e8f0',
        borderRadius: '10px', fontSize: '14px', background: '#f8fafc',
        outline: 'none', transition: 'border-color 0.2s'
    };

    const lbl = {
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '6px'
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', color: 'white' }}>
                <button onClick={() => router.push(user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard')}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '8px', borderRadius: '10px', color: 'white', cursor: 'pointer', display: 'flex' }}>
                    <ArrowLeft size={18} />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={22} /> Profile Settings
                </h1>
            </div>

            <div style={{ maxWidth: '600px', margin: '32px auto', padding: '0 20px' }}>
                <div style={{ background: 'white', borderRadius: '20px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ width: '80px', height: '80px', background: '#e0f2fe', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0ea5e9' }}>
                            <User size={40} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px', color: '#0f172a' }}>{user.name}</h2>
                            <span style={{ fontSize: '12px', fontWeight: '700', padding: '4px 12px', background: '#f1f5f9', color: '#64748b', borderRadius: '20px', textTransform: 'uppercase' }}>
                                {user.role} Account
                            </span>
                        </div>
                    </div>

                    <form onSubmit={handleSave}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={lbl}><User size={15} /> Full Name</label>
                            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                style={inp} onFocus={e => e.target.style.borderColor = '#0ea5e9'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={lbl}><Mail size={15} /> Email Address</label>
                            <input value={user.email} disabled
                                style={{ ...inp, background: '#f1f5f9', color: '#94a3b8', cursor: 'not-allowed' }} />
                            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px' }}>Email cannot be changed.</p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <label style={lbl}><Phone size={15} /> Phone Number</label>
                            <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91..."
                                style={inp} onFocus={e => e.target.style.borderColor = '#0ea5e9'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                        </div>

                        <button type="submit" disabled={loading}
                            style={{ width: '100%', background: '#0ea5e9', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.8 : 1, transition: 'background 0.2s' }}>
                            {loading ? (
                                <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                            ) : <Save size={18} />}
                            {loading ? 'Saving Changes...' : 'Save Changes'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}
