'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login({ email, password });
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      toast.success('Welcome back!');
      router.push(response.user.role === 'doctor' ? '/doctor/dashboard' : '/dashboard');
    } catch (error) {
      toast.error(error?.error || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: '100%', padding: '12px 14px',
    border: '1.5px solid #e2e8f0', borderRadius: '10px',
    fontSize: '14px', color: '#0f172a', background: '#fafafa',
    boxSizing: 'border-box', fontFamily: 'inherit',
    outline: 'none', transition: 'border-color 0.2s',
    appearance: 'none'
  };

  const lbl = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '6px'
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-page { animation: fadeUp 0.4s ease forwards; }
        .inp:focus {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 3px rgba(14,165,233,0.12) !important;
        }
        .btn-primary {
          background: #0ea5e9;
          transition: all 0.2s ease;
        }
        .btn-primary:hover {
          background: #0284c7 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(14,165,233,0.35) !important;
        }
      `}</style>

      <div className="login-page" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #e0f7fa 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: '500px' }}>

          {/* ── LOGO ── */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px', height: '56px',
              background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
              borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 8px 24px rgba(14,165,233,0.3)',
            }}>
              <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Sign in to manage your health data
            </p>
          </div>

          {/* ── FORM CARD ── */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '36px 40px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div style={{ marginBottom: '20px' }}>
                <label style={lbl}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="inp"
                  style={inp}
                  onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                  onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ ...lbl, margin: 0 }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: '12px', color: '#0ea5e9', textDecoration: 'none', fontWeight: '600' }}>
                    Forgot?
                  </Link>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="inp"
                    style={{ ...inp, paddingRight: '60px' }}
                    onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#0ea5e9',
                      fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: '4px'
                    }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn-primary"
                style={{
                  width: '100%', padding: '14px', color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.8 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
                }}>
                {loading ? (
                  <>
                    <span style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                    Signing in...
                  </>
                ) : 'Sign In →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '24px' }}>
            New to Diabetes Tracker?{' '}
            <Link href="/register" style={{ color: '#0ea5e9', fontWeight: '700', textDecoration: 'none' }}>
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}