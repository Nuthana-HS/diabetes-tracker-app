'use client';

import { useTranslation } from 'react-i18next';
import '@/i18n';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { QRCodeCanvas } from 'qrcode.react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import {
  Activity, Droplets, Heart, AlertCircle,
  Calendar, Pill, TrendingUp, TrendingDown, User,
  LogOut, Camera, QrCode, PlusCircle, FileDown,
  RefreshCw, Clock, BarChart2, Stethoscope
} from 'lucide-react';
import { getHbA1cHistory } from '@/services/hba1c';
import { getMedications } from '@/services/medications';
import HbA1cChart from '@/components/charts/HbA1cChart';
import { generateHealthReport } from '@/utils/pdfExport';
import toast from 'react-hot-toast';
import MedicationReminders from '@/components/MedicationReminders';
import { getUserProfile } from '@/services/api';
import GamificationBanner from '@/components/GamificationBanner';
import AiChat from '@/components/AiChat';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [readings, setReadings] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeds, setLoadingMeds] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    else router.push('/login');
  }, [router]);

  const fetchReadings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHbA1cHistory();
      setReadings(data);
    } catch {
      toast.error('Failed to load readings');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMedications = useCallback(async () => {
    try {
      setLoadingMeds(true);
      const data = await getMedications();
      setMedications(data);
    } catch {
      toast.error('Failed to load medications');
    } finally {
      setLoadingMeds(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
    } catch {
      console.error('Failed to fetch user profile');
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchReadings();
      fetchMedications();
      fetchUserProfile();
    }
  }, [user, fetchReadings, fetchMedications, fetchUserProfile]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchReadings(), fetchMedications(), fetchUserProfile()]);
    setRefreshing(false);
    toast.success('Data refreshed!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const current = readings.length > 0 ? readings[0].value : null;
  const previous = readings.length > 1 ? readings[1].value : null;
  const target = 7.0;

  const getHbA1cStatus = (value) => {
    if (!value) return { label: 'No Data', color: '#64748b', bg: '#f1f5f9', border: '#94a3b8', className: 'bg-slate-100 text-slate-500 border-slate-400 dark:bg-slate-800 dark:text-slate-400' };
    if (value < 7) return { label: '✓ Good', color: '#16a34a', bg: '#f0fdf4', border: '#22c55e', className: 'bg-green-50 text-green-600 border-green-500 dark:bg-green-900/30 dark:text-green-400' };
    if (value < 8) return { label: '⚠ Warning', color: '#d97706', bg: '#fffbeb', border: '#f59e0b', className: 'bg-amber-50 text-amber-600 border-amber-500 dark:bg-amber-900/30 dark:text-amber-400' };
    return { label: '⚠ High', color: '#dc2626', bg: '#fef2f2', border: '#ef4444', className: 'bg-red-50 text-red-600 border-red-500 dark:bg-red-900/30 dark:text-red-400' };
  };

  const getTrend = () => {
    if (!current || !previous) return { icon: Activity, color: '#94a3b8', text: t('add_more_readings'), className: 'text-slate-400' };
    if (current < previous) return { icon: TrendingDown, color: '#16a34a', text: t('improved_from', { previous }), className: 'text-green-600 dark:text-green-400' };
    if (current > previous) return { icon: TrendingUp, color: '#dc2626', text: t('increased_from', { previous }), className: 'text-red-600 dark:text-red-400' };
    return { icon: Activity, color: '#0ea5e9', text: t('stable'), className: 'text-sky-500 dark:text-sky-400' };
  };

  const status = getHbA1cStatus(current);
  const trend = getTrend();
  const TrendIcon = trend.icon;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .dash-page { animation: fadeUp 0.4s ease forwards; }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important; }
        .tab-btn { transition: all 0.2s ease; }
        .action-btn { transition: all 0.2s ease; }
        .action-btn:hover { transform: translateY(-1px); }
        .reading-row { transition: background 0.15s ease; }
        .fab-btn { transition: all 0.2s ease; }
        .fab-btn:hover { transform: scale(1.1); }
      `}</style>

      <div className="dash-page min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <MedicationReminders medications={medications} />
        {/* AI Chat Assistant */}
<div className="max-w-6xl mx-auto px-6 mt-8 mb-8">
  <AiChat userData={{ 
    morningAvg: userProfile?.morningAvg || 140, 
    postMealAvg: userProfile?.postMealAvg || 180,
    todayReading: userProfile?.todayReading || 130
  }} />
</div>

        {/* ── HEADER ── */}
        <div className="sticky top-0 z-20 bg-gradient-to-br from-sky-700 to-sky-500 shadow-md dark:shadow-sky-900/20">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div>
                <div className="text-white font-extrabold text-base tracking-tight">{t('app_name')}</div>
                <div className="text-white/70 text-[11px] leading-tight">{t('app_tagline')}</div>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher />
              <button onClick={handleRefresh} title="Refresh" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border-none cursor-pointer">
                <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button onClick={() => generateHealthReport(user, readings, medications)} title={t('download_pdf')} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border-none cursor-pointer">
                <FileDown size={15} />
              </button>
              <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full ml-1">
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center">
                  <User size={13} className="text-white" />
                </div>
                <span className="text-white text-[13px] font-semibold">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg border-none cursor-pointer text-[13px] font-semibold transition-colors">
                <LogOut size={14} /> {t('logout')}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-6">

          {/* ── WELCOME ROW ── */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="text-[22px] font-extrabold text-slate-900 dark:text-slate-50 m-0 mb-0.5 tracking-tight">
                {t('good_day', { name: user.name })}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] m-0">
                {new Date().toLocaleDateString(t('en-IN') || 'en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2.5">
              <button onClick={() => router.push('/blood-sugar')} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border-[1.5px] border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 px-3.5 py-2 rounded-xl text-[13px] font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all">
                <Droplets size={15} /> {t('blood_sugar')}
              </button>
              <button onClick={() => setShowQR(!showQR)} className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border-[1.5px] border-sky-200 dark:border-sky-900/50 text-sky-700 dark:text-sky-400 px-3.5 py-2 rounded-xl text-[13px] font-semibold cursor-pointer shadow-sm hover:shadow-md transition-all">
                <QrCode size={15} /> {t('share_doctor')}
              </button>
            </div>
          </div>

          {/* ── QR CODE ── */}
          {showQR && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mb-5 flex items-center gap-5 shadow-sm border border-sky-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <QRCodeCanvas value={`${window.location.origin}/share/${user.id}`} size={100} bgColor="#ffffff" fgColor="#0369a1" level="L" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base m-0 mb-1.5">{t('share_health_report')}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[13px] m-0 mb-3 leading-relaxed">
                  {t('share_qr_instruction')}
                </p>
                <button onClick={() => setShowQR(false)} className="bg-transparent border-none text-sky-500 hover:text-sky-600 dark:text-sky-400 text-[13px] font-semibold cursor-pointer p-0">
                  {t('hide_qr')} ×
                </button>
              </div>
            </div>
          )}

          <GamificationBanner streak={userProfile?.patient_info?.current_streak} />

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {/* HbA1c */}
            <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-4.5 shadow-sm border-t-4" style={{ borderTopColor: status.border }}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-sky-100 dark:bg-sky-900/30 rounded-xl flex items-center justify-center">
                  <Droplets size={18} className="text-sky-700 dark:text-sky-400" />
                </div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${status.className}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mb-1 uppercase tracking-wider font-semibold">{t('latest_hba1c')}</p>
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
                  {current ? `${current}%` : '--'}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">{t('target_value', { target })}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendIcon size={13} className={trend.className} />
                <span className={`text-xs font-semibold ${trend.className}`}>{trend.text}</span>
              </div>
              <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2.5 overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${current ? Math.min((current / 14) * 100, 100) : 0}%`, backgroundColor: status.border }} />
              </div>
            </div>

            {/* Medications */}
            <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-4.5 shadow-sm border-t-4 border-violet-400 dark:border-violet-500">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                  <Pill size={18} className="text-violet-600 dark:text-violet-400" />
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
                  {medications.length} {t('active')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mb-1 uppercase tracking-wider font-semibold">{t('medications')}</p>
              {medications.length > 0 ? (
                <>
                  <p className="text-[15px] font-bold text-slate-900 dark:text-slate-50 m-0 mb-1 whitespace-nowrap overflow-hidden text-ellipsis">{medications[0].name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 m-0">{medications[0].dosage} · {medications[0].frequency}</p>
                </>
              ) : (
                <p className="text-[13px] text-slate-400 dark:text-slate-500 m-0 mt-1">{t('no_medications')}</p>
              )}
            </div>

            {/* Blood Pressure */}
            <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-4.5 shadow-sm border-t-4 border-rose-400 dark:border-rose-500">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-rose-50 dark:bg-rose-900/30 rounded-xl flex items-center justify-center">
                  <Heart size={18} className="text-rose-500 dark:text-rose-400" />
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400">{t('normal')}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mb-1 uppercase tracking-wider font-semibold">{t('blood_pressure')}</p>
              <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 m-0 mb-1 tracking-tight">120/80</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 m-0">mmHg · {t('last')}: Mar 10</p>
            </div>

            {/* Appointment */}
            <div className="stat-card bg-white dark:bg-slate-800 rounded-2xl p-4.5 shadow-sm border-t-4 border-emerald-400 dark:border-emerald-500">
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">15 {t('days')}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mb-1 uppercase tracking-wider font-semibold">{t('next_appointment')}</p>
              <p className="text-[15px] font-bold text-slate-900 dark:text-slate-50 m-0 mb-1">Dr. Smith</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0 mb-1.5">Mar 28, 2026 · 10:30 AM</p>
              <button onClick={() => toast.success('Reschedule feature coming soon!')} className="bg-transparent border-none text-sky-500 hover:text-sky-600 dark:text-sky-400 text-xs font-semibold cursor-pointer p-0">
                {t('reschedule')} →
              </button>
            </div>
          </div>

          {/* ── ANNUAL CHECKUPS ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-4.5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Stethoscope size={16} className="text-sky-500 dark:text-sky-400" />
                <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{t('annual_checkups')}</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{t('yearly_reminders')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: t('eye_exam'), last: 'Jan 15, 2026', status: 'done', note: t('no_retinopathy') },
                { name: t('kidney_test'), last: 'Dec 10, 2025', status: 'due', note: t('due_soon') },
                { name: t('foot_exam'), last: 'Feb 20, 2026', status: 'done', note: t('good_circulation') },
              ].map(c => (
                <div key={c.name} className={`p-3 rounded-xl border flex items-center gap-3 ${c.status === 'done' ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30' : 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${c.status === 'done' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
                    {c.status === 'done' ? <Activity size={15} /> : <AlertCircle size={15} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-50 m-0 mb-0.5">{c.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0 mb-0.5">{t('last')}: {c.last}</p>
                    <p className={`text-[11px] m-0 font-semibold ${c.status === 'done' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {c.status === 'done' ? `✓ ${c.note}` : `⚠ ${c.note}`}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-1 rounded-full whitespace-nowrap ${c.status === 'done' ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'}`}>
                    {c.status === 'done' ? `✓ ${t('done')}` : `⚠ ${t('due')}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b border-slate-100 dark:border-slate-700">
              {[
                { key: 'timeline', label: t('hba1c_timeline'), Icon: BarChart2 },
                { key: 'medications', label: t('medications_tab'), Icon: Pill },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`tab-btn flex items-center gap-1.5 px-5 py-3.5 border-none bg-transparent cursor-pointer text-[13px] hover:bg-slate-50 dark:hover:bg-slate-700/50 -mb-[1px] ${activeTab === tab.key ? 'font-bold text-sky-500 dark:text-sky-400 border-b-2 border-b-sky-500 dark:border-b-sky-400' : 'font-medium text-slate-500 dark:text-slate-400 border-b-2 border-b-transparent'}`}>
                  <tab.Icon size={15} />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div>
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <>
                      <HbA1cChart readings={readings} target={7.0} />

                      {readings.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">
                            {t('recent_readings')}
                          </h4>
                          <div className="flex flex-col gap-2">
                            {readings.slice(0, 5).map((r, i) => (
                              <div key={r.id || i} className="reading-row flex justify-between items-center p-3 px-3.5 bg-slate-50 dark:bg-slate-900 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
                                <div>
                                  <p className="text-[13px] font-semibold text-slate-900 dark:text-slate-50 m-0">
                                    {new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  {r.notes && <p className="text-[11px] text-slate-400 dark:text-slate-500 m-0 mt-0.5">{r.notes}</p>}
                                </div>
                                <span className={`text-[13px] font-bold px-3 py-1 rounded-full ${r.value < 7 ? 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' : r.value < 8 ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                                  {r.value}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {readings.length === 0 && (
                        <div className="text-center py-12">
                          <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-3.5">
                            <Droplets size={28} className="text-sky-700 dark:text-sky-400" />
                          </div>
                          <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-50 m-0 mb-1.5">{t('no_readings')}</p>
                          <p className="text-[13px] text-slate-500 dark:text-slate-400 m-0 mb-5">{t('add_first_reading')}</p>
                          <div className="flex gap-3 justify-center">
                            <button onClick={() => router.push('/add-reading')} className="bg-sky-500 dark:bg-sky-600 text-white border-none px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer inline-flex items-center gap-1.5 hover:bg-sky-600 dark:hover:bg-sky-500 transition-colors">
                              <PlusCircle size={15} /> {t('add_first_reading')}
                            </button>
                          </div>
                        </div>
                      )}

                      {readings.length > 0 && (
                        <div className="flex gap-3 mt-5">
                          <button onClick={() => router.push('/add-reading')} className="action-btn flex-1 bg-sky-500 dark:bg-sky-600 text-white border-none p-3 rounded-xl text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-sky-600 dark:hover:bg-sky-500">
                            <PlusCircle size={15} /> {t('add_reading')}
                          </button>
                          <button onClick={() => router.push('/add-reading?scan=true')} className="action-btn flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 border-[1.5px] border-slate-200 dark:border-slate-700 p-3 rounded-xl text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm">
                            <Camera size={15} /> {t('scan_report')}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Medications Tab */}
              {activeTab === 'medications' && (
                <div>
                  {loadingMeds ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div>
                      {medications.length > 0 ? (
                        <div className="flex flex-col gap-2.5">
                          {medications.map(med => (
                            <div key={med.id} className="p-4 bg-violet-50 dark:bg-violet-900/10 rounded-xl border border-violet-200 dark:border-violet-900/30 flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center shrink-0">
                                  <Pill size={18} className="text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                  <p className="text-[15px] font-bold text-slate-900 dark:text-slate-50 m-0 mb-1">{med.name}</p>
                                  <p className="text-[13px] text-slate-500 dark:text-slate-400 m-0 mb-1">{med.dosage} · {med.frequency}</p>
                                  <p className="text-[11px] text-slate-400 dark:text-slate-500 m-0">
                                    {t('started')}: {new Date(med.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </p>
                                  {med.is_current && (
                                    <p className="text-[11px] text-sky-500 dark:text-sky-400 m-0 mt-1 flex items-center gap-1">
                                      <Clock size={11} /> {t('next_dose')}: {med.frequency === 'Twice daily' ? '8:00 PM' : t('as_scheduled')}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${med.is_current ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                                  {med.is_current ? t('active') : t('inactive')}
                                </span>
                                {med.is_current && (
                                  <button onClick={() => toast.success(`✓ ${t('marked_taken')} ${med.name}!`)} className="bg-white dark:bg-slate-800 border border-violet-200 dark:border-violet-700 text-violet-600 dark:text-violet-400 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer hover:bg-violet-50 dark:hover:bg-slate-700 transition-colors">
                                    {t('mark_taken')}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                          <button onClick={() => router.push('/add-medication')} className="action-btn w-full bg-violet-600 dark:bg-violet-700 text-white border-none p-3 rounded-xl text-[13px] font-bold cursor-pointer flex items-center justify-center gap-1.5 mt-1 hover:bg-violet-700 dark:hover:bg-violet-600 shadow-sm">
                            <PlusCircle size={15} /> {t('add_new_medication')}
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-3.5">
                            <Pill size={28} className="text-violet-600 dark:text-violet-400" />
                          </div>
                          <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-50 m-0 mb-1.5">{t('no_medications')}</p>
                          <p className="text-[13px] text-slate-500 dark:text-slate-400 m-0 mb-5">{t('track_daily_medications')}</p>
                          <button onClick={() => router.push('/add-medication')} className="bg-violet-600 dark:bg-violet-700 text-white border-none px-5 py-2.5 rounded-xl text-[13px] font-bold cursor-pointer inline-flex items-center gap-1.5 hover:bg-violet-700 dark:hover:bg-violet-600 transition-colors shadow-sm">
                            <PlusCircle size={15} /> {t('add_medication')}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── FAB BUTTONS ── */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-2.5">
          <button onClick={() => router.push('/add-reading?scan=true')} className="fab-btn w-12 h-12 bg-violet-600 text-white border-none rounded-full cursor-pointer flex items-center justify-center shadow-lg shadow-violet-600/40" title={t('scan_report')}>
            <Camera size={20} />
          </button>
          <button onClick={() => router.push('/add-reading')} className="fab-btn w-12 h-12 bg-emerald-600 text-white border-none rounded-full cursor-pointer flex items-center justify-center shadow-lg shadow-emerald-600/40" title={t('add_reading')}>
            <Activity size={20} />
          </button>
          <button onClick={() => router.push('/add-medication')} className="fab-btn w-12 h-12 bg-sky-500 text-white border-none rounded-full cursor-pointer flex items-center justify-center shadow-lg shadow-sky-500/40" title={t('add_medication')}>
            <Pill size={20} />
          </button>
        </div>

      </div>
    </>
  );
}
