'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, LogOut, User, Activity } from 'lucide-react';
import QRScanner from '@/components/QRScanner';

export default function DoctorDashboard() {
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const parsed = JSON.parse(userStr);
            if (parsed.role !== 'doctor') {
                router.push('/dashboard');
                return;
            }
            setDoctor(parsed);
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    if (!doctor) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid #0ea5e9', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0ea5e9 100%)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'white', boxShadow: '0 2px 10px rgba(14,165,233,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Activity size={20} color="white" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0 }}>Doctor Portal</h1>
                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0 }}>Diabetes Tracker</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <button onClick={() => router.push('/profile')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', padding: '8px 14px', borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={14} /> Profile
                    </button>
                    <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.5)', padding: '8px 14px', borderRadius: '8px', color: 'white', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            {/* WELCOME */}
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: '0 0 8px' }}>
                        Welcome, Dr. {doctor.name.split(' ')[0]}
                    </h2>
                    <p style={{ fontSize: '15px', color: '#64748b', margin: 0 }}>
                        Ready to review your patient's health reports?
                    </p>
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>

                    <div style={{ background: 'white', borderRadius: '20px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e0f2fe' }}>
                        <div style={{ width: '70px', height: '70px', background: '#e0f2fe', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#0ea5e9' }}>
                            <QrCode size={36} />
                        </div>
                        <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 10px', color: '#0f172a' }}>Scan Patient QR</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineHeight: 1.5 }}>
                            Use your device camera to scan a patient's QR code and instantly view their complete HbA1c, blood sugar, and medication history.
                        </p>
                        <button onClick={() => setShowScanner(!showScanner)}
                            style={{ width: '100%', background: showScanner ? '#ef4444' : '#0ea5e9', color: 'white', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s' }}>
                            <QrCode size={18} /> {showScanner ? 'Close Scanner' : 'Open Scanner'}
                        </button>

                        {showScanner && (
                            <div style={{ marginTop: '20px' }}>
                                <QRScanner
                                    onScanSuccess={(text) => {
                                        setShowScanner(false);
                                        window.location.href = text;
                                    }}
                                    onScanFailure={() => { }}
                                />
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
