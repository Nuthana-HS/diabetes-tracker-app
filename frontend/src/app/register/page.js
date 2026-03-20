'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/api';
import toast from 'react-hot-toast';

const getStrength = (p) => {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
};

const strengthInfo = [
  { label: '', color: '#e2e8f0' },
  { label: 'Very Weak', color: '#ef4444' },
  { label: 'Weak', color: '#f97316' },
  { label: 'Fair', color: '#eab308' },
  { label: 'Strong', color: '#22c55e' },
  { label: 'Very Strong', color: '#16a34a' },
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '',
    confirmPassword: '', role: 'patient',
    diabetesType: '', bloodGroup: '',
    dateOfBirth: '', gender: '',
    insulinDependent: '',
    emergencyContactName: '', emergencyContactPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const router = useRouter();

  const set = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handle = (e) => set(e.target.id, e.target.value);

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.name.trim()) { setError('Please enter your full name'); return false; }
      if (!formData.email.trim()) { setError('Please enter your email'); return false; }
      if (!formData.role) { setError('Please select your role'); return false; }
      return true;
    }
    if (step === 2) {
      if (!formData.password) { setError('Please enter a password'); return false; }
      if (formData.password.length < 8) { setError('Password must be at least 8 characters'); return false; }
      if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return false; }
      return true;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => { setStep(s => s - 1); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('🎉 Account created! Please sign in.');
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      const msg = err?.error || 'Registration failed';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(formData.password);
  const sInfo = strengthInfo[strength];

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

  const steps = ['Account Info', 'Set Password', 'Health Profile'];

  const getAge = () => {
    if (!formData.dateOfBirth) return null;
    return Math.floor((new Date() - new Date(formData.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .reg-page { animation: fadeUp 0.4s ease forwards; }
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
        .role-btn { transition: all 0.2s ease; }
        .role-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .type-btn { transition: all 0.15s ease; }
        .type-btn:hover { border-color: #0ea5e9 !important; background: #f0f9ff !important; }
        .insulin-btn { transition: all 0.2s ease; }
        .insulin-btn:hover { transform: translateY(-1px); }
        .step-dot { transition: all 0.4s cubic-bezier(0.4,0,0.2,1); }
      `}</style>

      <div className="reg-page" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 40%, #e0f7fa 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '32px 16px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: '560px' }}>

          {/* ── LOGO ── */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
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
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
              Join Diabetes Tracker
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
              Start your health journey — completely free
            </p>
          </div>

          {/* ── PROGRESS STEPS ── */}
          <div style={{
            background: 'white', borderRadius: '14px',
            padding: '14px 24px', marginBottom: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div className="step-dot" style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: '800',
                    background: step > i + 1 ? '#22c55e' : step === i + 1 ? '#0ea5e9' : '#f1f5f9',
                    color: step >= i + 1 ? 'white' : '#94a3b8',
                    boxShadow: step === i + 1 ? '0 0 0 4px rgba(14,165,233,0.2)' : 'none',
                  }}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: step === i + 1 ? '700' : '500',
                    color: step === i + 1 ? '#0ea5e9' : step > i + 1 ? '#22c55e' : '#94a3b8',
                    whiteSpace: 'nowrap'
                  }}>{s}</span>
                </div>
                {i < 2 && (
                  <div style={{
                    flex: 1, height: '2px', margin: '0 8px', marginBottom: '16px',
                    background: step > i + 1 ? '#22c55e' : '#e2e8f0',
                    borderRadius: '4px', transition: 'background 0.4s ease'
                  }} />
                )}
              </div>
            ))}
          </div>

          {/* ── FORM CARD ── */}
          <div style={{
            background: 'white', borderRadius: '20px',
            padding: '28px 32px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}>

            {error && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca',
                color: '#dc2626', padding: '11px 14px',
                borderRadius: '10px', fontSize: '13px', marginBottom: '20px',
                display: 'flex', alignItems: 'center', gap: '8px'
              }}>⚠️ {error}</div>
            )}

            {/* ── STEP 1: Account Info ── */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                  Create your account
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '22px' }}>
                  Let's start with your basic information
                </p>

                {/* Full Name */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={lbl}>Full Name *</label>
                  <input id="name" value={formData.name} onChange={handle}
                    placeholder="e.g. Priya Sharma" required className="inp"
                    style={inp}
                    onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                  />
                </div>

                {/* Email + Phone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={lbl}>Email Address *</label>
                    <input id="email" type="email" value={formData.email} onChange={handle}
                      placeholder="you@example.com" required className="inp"
                      style={inp}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  <div>
                    <label style={lbl}>Phone Number</label>
                    <input id="phone" type="tel" value={formData.phone} onChange={handle}
                      placeholder="+91 98765 43210" className="inp"
                      style={inp}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={lbl}>I am a: *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { v: 'patient', icon: '🧑‍🦯', title: 'Patient', desc: 'Track my own health', color: '#0ea5e9' },
                      { v: 'doctor', icon: '👨‍⚕️', title: 'Doctor', desc: 'Monitor my patients', color: '#8b5cf6' },
                    ].map(r => (
                      <button key={r.v} type="button"
                        onClick={() => set('role', r.v)}
                        className="role-btn"
                        style={{
                          padding: '14px', borderRadius: '12px',
                          textAlign: 'left', cursor: 'pointer',
                          border: '2px solid',
                          borderColor: formData.role === r.v ? r.color : '#e2e8f0',
                          background: formData.role === r.v ? `${r.color}12` : '#fafafa',
                        }}>
                        <div style={{ fontSize: '26px', marginBottom: '6px' }}>{r.icon}</div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{r.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{r.desc}</div>
                        {formData.role === r.v && (
                          <div style={{
                            marginTop: '8px', display: 'inline-block',
                            background: r.color, color: 'white',
                            padding: '2px 10px', borderRadius: '20px',
                            fontSize: '11px', fontWeight: '700'
                          }}>✓ Selected</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="button" onClick={nextStep} className="btn-primary"
                  style={{ width: '100%', padding: '14px', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>
                  Continue →
                </button>
              </div>
            )}

            {/* ── STEP 2: Password ── */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                  🔐 Secure Your Account
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '22px' }}>
                  Create a strong password to protect your health data
                </p>

                {/* Password */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input id="password" type={showPass ? 'text' : 'password'}
                      value={formData.password} onChange={handle}
                      placeholder="Min 8 characters" className="inp"
                      style={{ ...inp, paddingRight: '65px' }}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#0ea5e9', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      {showPass ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {formData.password && (
                    <div style={{ marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1,2,3,4,5].map(i => (
                          <div key={i} style={{
                            height: '5px', flex: 1, borderRadius: '5px',
                            background: i <= strength ? sInfo.color : '#e2e8f0',
                            transition: 'background 0.3s'
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '12px', color: sInfo.color, fontWeight: '700' }}>{sInfo.label}</span>
                    </div>
                  )}

                  {/* Requirements */}
                  <div style={{ marginTop: '10px', background: '#f8fafc', borderRadius: '10px', padding: '12px 14px', border: '1px solid #f1f5f9' }}>
                    <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Password requirements
                    </p>
                    {[
                      { ok: formData.password.length >= 8, text: 'At least 8 characters' },
                      { ok: /[A-Z]/.test(formData.password), text: 'One uppercase letter (A-Z)' },
                      { ok: /[0-9]/.test(formData.password), text: 'One number (0-9)' },
                    ].map(r => (
                      <div key={r.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: r.ok ? '#22c55e' : '#e2e8f0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0, transition: 'background 0.3s',
                          fontSize: '9px', color: 'white', fontWeight: '700'
                        }}>
                          {r.ok ? '✓' : ''}
                        </div>
                        <span style={{ fontSize: '12px', color: r.ok ? '#15803d' : '#94a3b8', transition: 'color 0.3s' }}>
                          {r.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div style={{ marginBottom: '26px' }}>
                  <label style={lbl}>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <input id="confirmPassword" type={showConfirmPass ? 'text' : 'password'}
                      value={formData.confirmPassword} onChange={handle}
                      placeholder="Re-enter your password" className="inp"
                      style={{
                        ...inp, paddingRight: '65px',
                        borderColor: formData.confirmPassword
                          ? formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444'
                          : '#e2e8f0'
                      }}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#0ea5e9', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                      {showConfirmPass ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <p style={{ fontSize: '12px', marginTop: '5px', fontWeight: '600', color: formData.password === formData.confirmPassword ? '#22c55e' : '#ef4444' }}>
                      {formData.password === formData.confirmPassword ? '✓ Passwords match!' : '✗ Passwords do not match'}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={prevStep}
                    style={{ flex: 1, padding: '13px', background: '#f8fafc', color: '#374151', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    ← Back
                  </button>
                  <button type="button" onClick={nextStep} className="btn-primary"
                    style={{ flex: 2, padding: '13px', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' }}>
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Health Profile ── */}
            {step === 3 && (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px' }}>
                  🏥 Your Health Profile
                </h2>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '22px' }}>
                  Help us personalize your experience
                </p>

                {/* Gender + DOB */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={lbl}>Gender</label>
                    <div style={{ position: 'relative' }}>
                      <select value={formData.gender}
                        onChange={e => set('gender', e.target.value)}
                        className="inp"
                        style={{ ...inp, cursor: 'pointer', paddingRight: '36px' }}>
                        <option value="">Select gender</option>
                        <option value="female">👩 Female</option>
                        <option value="male">👨 Male</option>
                        <option value="other">🧑 Other</option>
                        <option value="prefer_not">🔒 Prefer not to say</option>
                      </select>
                      <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={lbl}>Date of Birth</label>
                    <input id="dateOfBirth" type="date"
                      value={formData.dateOfBirth} onChange={handle}
                      className="inp"
                      style={inp}
                      max={new Date().toISOString().split('T')[0]}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    {getAge() && (
                      <p style={{ fontSize: '11px', color: '#0ea5e9', marginTop: '4px', fontWeight: '600' }}>
                        Age: {getAge()} years old
                      </p>
                    )}
                  </div>
                </div>

                {/* Blood Group */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={lbl}>Blood Group 🩸</label>
                  <div style={{ position: 'relative' }}>
                    <select value={formData.bloodGroup}
                      onChange={e => set('bloodGroup', e.target.value)}
                      className="inp"
                      style={{
                        ...inp, cursor: 'pointer', paddingRight: '36px',
                        borderColor: formData.bloodGroup ? '#0ea5e9' : '#e2e8f0',
                        background: formData.bloodGroup ? '#f0f9ff' : '#fafafa',
                      }}>
                      <option value="">🔍 Select your blood group</option>
                      <option value="A+">🅰️ A+ (A Positive)</option>
                      <option value="A-">🅰️ A- (A Negative)</option>
                      <option value="B+">🅱️ B+ (B Positive)</option>
                      <option value="B-">🅱️ B- (B Negative)</option>
                      <option value="O+">⭕ O+ (O Positive) — Most Common</option>
                      <option value="O-">⭕ O- (O Negative) — Universal Donor</option>
                      <option value="AB+">🆎 AB+ — Universal Recipient</option>
                      <option value="AB-">🆎 AB- (AB Negative)</option>
                      <option value="unknown">❓ I don't know my blood group</option>
                    </select>
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                      <svg width="14" height="14" fill="none" stroke="#64748b" strokeWidth="2" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                  {/* Blood group info card */}
                  {formData.bloodGroup && formData.bloodGroup !== 'unknown' && (
                    <div style={{ marginTop: '8px', padding: '10px 14px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '22px' }}>
                        {formData.bloodGroup.includes('AB') ? '🆎' : formData.bloodGroup.startsWith('A') ? '🅰️' : formData.bloodGroup.startsWith('B') ? '🅱️' : '⭕'}
                      </span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: '700', color: '#0369a1', margin: 0 }}>
                          Blood Group: {formData.bloodGroup}
                        </p>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
                          {formData.bloodGroup === 'O-' ? '✓ Universal Donor — can donate to anyone' :
                           formData.bloodGroup === 'AB+' ? '✓ Universal Recipient — can receive from anyone' :
                           formData.bloodGroup.includes('+') ? 'Rh Positive blood type' : 'Rh Negative blood type'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Diabetes Type — patients only */}
                {formData.role === 'patient' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>Diabetes Type 🩺</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {[
                        { v: 'type1', icon: '💉', label: 'Type 1', desc: 'Body produces no insulin' },
                        { v: 'type2', icon: '🍎', label: 'Type 2', desc: 'Body resists insulin' },
                        { v: 'gestational', icon: '🤱', label: 'Gestational', desc: 'Occurs during pregnancy' },
                        { v: 'prediabetes', icon: '⚠️', label: 'Pre-diabetes', desc: 'Blood sugar higher than normal' },
                      ].map(t => (
                        <button key={t.v} type="button"
                          onClick={() => set('diabetesType', t.v)}
                          className="type-btn"
                          style={{
                            padding: '11px 12px', borderRadius: '10px',
                            textAlign: 'left', cursor: 'pointer',
                            border: '1.5px solid',
                            borderColor: formData.diabetesType === t.v ? '#0ea5e9' : '#e2e8f0',
                            background: formData.diabetesType === t.v ? '#f0f9ff' : '#fafafa',
                          }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                            <span style={{ fontSize: '15px' }}>{t.icon}</span>
                            <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '13px' }}>{t.label}</span>
                            {formData.diabetesType === t.v && (
                              <span style={{ marginLeft: 'auto', width: '16px', height: '16px', background: '#0ea5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white', fontWeight: '700', flexShrink: 0 }}>✓</span>
                            )}
                          </div>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Insulin Dependent — patients only */}
                {formData.role === 'patient' && (
                  <div style={{ marginBottom: '16px' }}>
                    <label style={lbl}>
                      Are you Insulin Dependent? 💉
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400', marginLeft: '6px' }}>
                        (Even Type 2 patients can use insulin)
                      </span>
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {[
                        { v: 'yes', icon: '💉', label: 'Yes', desc: 'I use insulin injections', color: '#0ea5e9' },
                        { v: 'no', icon: '💊', label: 'No', desc: 'I use oral medications', color: '#22c55e' },
                      ].map(opt => (
                        <button key={opt.v} type="button"
                          onClick={() => set('insulinDependent', opt.v)}
                          className="insulin-btn"
                          style={{
                            padding: '14px', borderRadius: '12px',
                            textAlign: 'left', cursor: 'pointer',
                            border: '2px solid',
                            borderColor: formData.insulinDependent === opt.v ? opt.color : '#e2e8f0',
                            background: formData.insulinDependent === opt.v ? `${opt.color}12` : '#fafafa',
                            display: 'flex', alignItems: 'center', gap: '10px'
                          }}>
                          <span style={{ fontSize: '24px' }}>{opt.icon}</span>
                          <div>
                            <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>{opt.label}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{opt.desc}</div>
                          </div>
                          {formData.insulinDependent === opt.v && (
                            <div style={{ marginLeft: 'auto', width: '20px', height: '20px', background: opt.color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span style={{ color: 'white', fontSize: '11px', fontWeight: '700' }}>✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ ...lbl, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🚨 Emergency Contact
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>(Recommended for safety)</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input id="emergencyContactName"
                      value={formData.emergencyContactName} onChange={handle}
                      placeholder="Contact name" className="inp" style={inp}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                    <input id="emergencyContactPhone"
                      value={formData.emergencyContactPhone} onChange={handle}
                      placeholder="Phone number" type="tel" className="inp" style={inp}
                      onFocus={e => e.target.style.borderColor = '#0ea5e9'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                </div>

                {/* Everything free banner */}
                <div style={{
                  background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                  border: '1px solid #bbf7d0',
                  borderRadius: '12px', padding: '14px 16px', marginBottom: '18px'
                }}>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🎉 Everything included — 100% free!
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {[
                      'HbA1c tracking',
                      'Blood sugar log',
                      'Medication tracker',
                      'Doctor QR sharing',
                      'PDF health reports',
                      'Dark & light mode',
                    ].map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          width: '15px', height: '15px', background: '#22c55e',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexShrink: 0,
                          fontSize: '9px', color: 'white', fontWeight: '800'
                        }}>✓</span>
                        <span style={{ fontSize: '12px', color: '#374151' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '18px' }}>
                  <input type="checkbox" id="terms" required
                    style={{ marginTop: '2px', cursor: 'pointer', accentColor: '#0ea5e9', width: '16px', height: '16px', flexShrink: 0 }}
                  />
                  <label htmlFor="terms" style={{ fontSize: '12px', color: '#64748b', cursor: 'pointer', lineHeight: 1.6 }}>
                    I agree to the{' '}
                    <Link href="/terms" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600' }}>
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link href="/privacy" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: '600' }}>
                      Privacy Policy
                    </Link>
                    . My health data is private and secure.
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="button" onClick={prevStep}
                    style={{ flex: 1, padding: '13px', background: '#f8fafc', color: '#374151', border: '1.5px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading} className="btn-primary"
                    style={{ flex: 2, padding: '13px', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1 }}>
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                        Creating account...
                      </span>
                    ) : '🎉 Create My Account'}
                  </button>
                </div>
              </form>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: '16px' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0ea5e9', fontWeight: '700', textDecoration: 'none' }}>
              Sign in here
            </Link>
          </p>

        </div>
      </div>
    </>
  );
}