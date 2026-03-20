'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, Camera, Save, Droplets } from 'lucide-react';
import CameraComponent from '@/components/Camera';
import { saveHbA1c } from '@/services/hba1c';
import Tesseract from 'tesseract.js';
import toast from 'react-hot-toast';

function AddReadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [date, setDate] = useState(new Date());
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [saving, setSaving] = useState(false);

  // Auto open camera if ?scan=true in URL
  useEffect(() => {
    if (searchParams.get('scan') === 'true') {
      setShowCamera(true);
    }
  }, [searchParams]);

  const handleCapture = async (imageSrc) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);

    const toastId = toast.loading('Reading lab report with OCR...');
    try {
      const { data: { text } } = await Tesseract.recognize(imageSrc, 'eng', {
        logger: m => m.status === 'recognizing text' &&
          console.log(`OCR: ${Math.round(m.progress * 100)}%`)
      });

      const patterns = [
        /hba1c[:\s]*(\d+\.?\d*)/i,
        /haemoglobin\s+a1c[:\s]*(\d+\.?\d*)/i,
        /(\d+\.?\d*)\s*%/,
        /(\d+\.?\d*)/
      ];

      let detected = null;
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match?.[1]) {
          const num = parseFloat(match[1]);
          if (num >= 4 && num <= 14) {
            detected = match[1];
            break;
          }
        }
      }

      if (detected) {
        setValue(detected);
        toast.success(`Detected HbA1c: ${detected}%`, { id: toastId });
      } else {
        toast.error('Could not detect value. Please enter manually.', { id: toastId });
      }
    } catch {
      toast.error('OCR failed. Please enter value manually.', { id: toastId });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const num = parseFloat(value);
    if (!value || isNaN(num) || num < 4 || num > 14) {
      toast.error('Please enter a valid HbA1c value between 4 and 14');
      return;
    }
    setSaving(true);
    try {
      await saveHbA1c({
        value: num,
        date: date.toISOString().split('T')[0],
        notes
      });
      toast.success('Reading saved successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error?.error || 'Failed to save reading');
    } finally {
      setSaving(false);
    }
  };

  const getStatusInfo = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return null;
    if (num < 7) return {
      color: 'bg-green-100 text-green-700 border-green-200',
      label: '✅ Good Control (< 7%)'
    };
    if (num < 8) return {
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      label: '⚠️ Warning (7–8%) - Consult Doctor'
    };
    return {
      color: 'bg-red-100 text-red-700 border-red-200',
      label: '🔴 High (> 8%) - See Doctor Soon'
    };
  };

  const statusInfo = getStatusInfo(value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Add HbA1c Reading</h1>
              <p className="text-blue-100 text-xs">Track your blood sugar progress</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Droplets className="h-5 w-5 text-blue-600" />
              Enter Your HbA1c Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Date Picker */}
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Test Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(date, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* HbA1c Value */}
              <div className="space-y-2">
                <Label htmlFor="value" className="dark:text-gray-300">HbA1c Value (%)</Label>
                <div className="flex gap-2">
                  <Input
                    id="value"
                    type="number"
                    step="0.1"
                    min="4"
                    max="14"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g., 7.2"
                    required
                    className={`flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCamera(true)}
                    className="whitespace-nowrap dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" /> Scan Report
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Valid range: 4.0 – 14.0%</p>
              </div>

              {/* Status Indicator */}
              {statusInfo && (
                <div className={`p-3 rounded-lg border text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </div>
              )}

              {/* Captured Image Preview */}
              {capturedImage && (
                <div className="border rounded-lg p-3 dark:border-gray-600">
                  <p className="text-sm font-medium mb-2 dark:text-gray-300">
                    Captured Lab Report:
                  </p>
                  <img
                    src={capturedImage}
                    alt="Lab report"
                    className="max-h-32 rounded object-cover"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs text-red-500"
                    onClick={() => { setCapturedImage(null); setValue(''); }}
                  >
                    ✕ Remove
                  </Button>
                </div>
              )}

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="dark:text-gray-300">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes about this reading..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 text-sm resize-none"
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!value || saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </div>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Reading</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
          <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 text-sm">
            📋 How to use:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li><strong>Manual entry:</strong> Type your HbA1c value directly</li>
            <li><strong>Scan Report:</strong> Take a photo of your lab report for auto-detection</li>
            <li><strong>Color coding:</strong> Green (&lt;7%), Yellow (7–8%), Red (&gt;8%)</li>
          </ul>
        </div>
      </div>

      {/* Camera Modal */}
      {showCamera && (
        <CameraComponent
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default function AddReadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AddReadingContent />
    </Suspense>
  );
}