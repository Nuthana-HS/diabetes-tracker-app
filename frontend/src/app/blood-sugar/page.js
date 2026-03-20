'use client';

import '@/i18n';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Droplets, PlusCircle, Trash2, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { getBloodSugarReadings, saveBloodSugarReading, deleteBloodSugarReading } from '@/services/bloodSugar';
import toast from 'react-hot-toast';

const READING_TYPES = [
  { value: 'fasting', label: '🌅 Fasting (morning before eating)' },
  { value: 'post_meal', label: '🍽️ After Meal (2 hours after eating)' },
  { value: 'bedtime', label: '🌙 Bedtime' },
  { value: 'random', label: '🔀 Random' },
];

const getStatus = (value, type) => {
  if (type === 'fasting') {
    if (value < 100) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    if (value < 126) return { label: 'Warning', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    return { label: 'High', color: 'text-red-700', bg: 'bg-red-100' };
  } else {
    if (value < 140) return { label: 'Normal', color: 'text-green-700', bg: 'bg-green-100' };
    if (value < 200) return { label: 'Warning', color: 'text-yellow-700', bg: 'bg-yellow-100' };
    return { label: 'High', color: 'text-red-700', bg: 'bg-red-100' };
  }
};

export default function BloodSugarPage() {
  const router = useRouter();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [value, setValue] = useState('');
  const [readingType, setReadingType] = useState('fasting');
  const [notes, setNotes] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      setLoading(true);
      const data = await getBloodSugarReadings();
      setReadings(data);
    } catch (error) {
      toast.error('Failed to load readings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!value || isNaN(num) || num < 20 || num > 600) {
      toast.error('Please enter a valid blood sugar value (20-600 mg/dL)');
      return;
    }
    setSaving(true);
    try {
      await saveBloodSugarReading({
        value: num,
        reading_type: readingType,
        notes,
        recorded_at: new Date().toISOString(),
      });
      toast.success('Blood sugar reading saved!');
      setValue('');
      setNotes('');
      setShowForm(false);
      fetchReadings();
    } catch (error) {
      toast.error(error?.error || 'Failed to save reading');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBloodSugarReading(id);
      toast.success('Reading deleted');
      setReadings(readings.filter(r => r.id !== id));
    } catch (error) {
      toast.error('Failed to delete reading');
    }
  };

  // Today's readings
  const today = new Date().toDateString();
  const todayReadings = readings.filter(r =>
    new Date(r.recorded_at).toDateString() === today
  );

  // Latest reading
  const latest = readings[0];
  const latestStatus = latest ? getStatus(latest.value, latest.reading_type) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Blood Sugar Log</h1>
            <p className="text-blue-100 text-xs">Track your daily glucose readings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-50 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Add Reading
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-t-4 border-blue-400">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Latest Reading</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {latest ? `${latest.value}` : '--'}
            </p>
            <p className="text-xs text-gray-400">mg/dL</p>
            {latestStatus && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-2 inline-block ${latestStatus.bg} ${latestStatus.color}`}>
                {latestStatus.label}
              </span>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-t-4 border-green-400">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Today's Readings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayReadings.length}</p>
            <p className="text-xs text-gray-400">recorded today</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border-t-4 border-purple-400">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total Readings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{readings.length}</p>
            <p className="text-xs text-gray-400">all time</p>
          </div>
        </div>

        {/* Reference Ranges */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-3">
            📊 Normal Blood Sugar Ranges
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🌅 Fasting</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Normal</span>
                  <span className="text-gray-500">70–99 mg/dL</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-600">Warning</span>
                  <span className="text-gray-500">100–125 mg/dL</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">High</span>
                  <span className="text-gray-500">126+ mg/dL</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">🍽️ After Meal</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Normal</span>
                  <span className="text-gray-500">&lt;140 mg/dL</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-yellow-600">Warning</span>
                  <span className="text-gray-500">140–199 mg/dL</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">High</span>
                  <span className="text-gray-500">200+ mg/dL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add Reading Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-5 border border-blue-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-4">
              Add New Reading
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Reading Type</Label>
                <Select value={readingType} onValueChange={setReadingType}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {READING_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="dark:text-gray-300">
                  Blood Sugar Value (mg/dL)
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="value"
                    type="number"
                    min="20"
                    max="600"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g., 95"
                    required
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <span className="text-sm text-gray-500 whitespace-nowrap">mg/dL</span>
                </div>
                {value && !isNaN(parseFloat(value)) && (
                  <div className={`text-xs font-medium px-3 py-1.5 rounded-lg inline-block ${
                    getStatus(parseFloat(value), readingType).bg
                  } ${getStatus(parseFloat(value), readingType).color}`}>
                    {getStatus(parseFloat(value), readingType).label} — {
                      readingType === 'fasting'
                        ? parseFloat(value) < 100 ? 'Good fasting level' : parseFloat(value) < 126 ? 'Pre-diabetic range' : 'Diabetic range — consult doctor'
                        : parseFloat(value) < 140 ? 'Good post-meal level' : parseFloat(value) < 200 ? 'Slightly high — monitor' : 'High — consult doctor'
                    }
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="dark:text-gray-300">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., after lunch, feeling dizzy..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Saving...
                    </div>
                  ) : 'Save Reading'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Readings List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-white">Recent Readings</h3>
            <span className="text-xs text-gray-400">{readings.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : readings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Droplets className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">No readings yet</p>
              <p className="text-gray-400 text-sm mb-4">Start tracking your daily blood sugar</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" /> Add First Reading
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {readings.map((reading) => {
                const s = getStatus(reading.value, reading.reading_type);
                const typeLabel = READING_TYPES.find(t => t.value === reading.reading_type)?.label || reading.reading_type;
                return (
                  <div key={reading.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg">
                        <Droplets className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                          {typeLabel.split('(')[0].trim()}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(reading.recorded_at).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                        {reading.notes && (
                          <p className="text-xs text-gray-400 italic mt-0.5">{reading.notes}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">{reading.value} <span className="text-xs font-normal text-gray-400">mg/dL</span></p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(reading.id)}
                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}