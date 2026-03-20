'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, Save, Pill, X } from 'lucide-react';
import { saveMedication } from '@/services/medications';
import toast from 'react-hot-toast';

const FREQUENCIES = [
  'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
  'Every morning', 'Every evening', 'At bedtime',
  'Every 6 hours', 'Every 8 hours', 'Every 12 hours',
  'Once weekly', 'As needed'
];

const COMMON_MEDS = [
  'Metformin', 'Glipizide', 'Insulin Glargine',
  'Sitagliptin', 'Empagliflozin', 'Liraglutide'
];

export default function AddMedicationPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || !frequency) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSaving(true);
    try {
      await saveMedication({
        name: name.trim(),
        dosage: dosage.trim(),
        frequency,
        start_date: format(startDate, 'yyyy-MM-dd'),
        end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null,
        is_current: true
      });
      toast.success('Medication added successfully!');
      router.push('/dashboard');
    } catch (error) {
      toast.error(error?.error || 'Failed to save medication');
    } finally {
      setSaving(false);
    }
  };

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
              <h1 className="text-xl font-bold">Add Medication</h1>
              <p className="text-blue-100 text-xs">Track your diabetes medications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Pill className="h-5 w-5 text-purple-600" />
              Medication Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Common Medications Quick Select */}
              <div className="space-y-2">
                <Label className="dark:text-gray-300 text-sm">
                  Quick Select Common Medications
                </Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_MEDS.map((med) => (
                    <button
                      key={med}
                      type="button"
                      onClick={() => setName(med)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                        name === med
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'
                      }`}
                    >
                      {med}
                    </button>
                  ))}
                </div>
              </div>

              {/* Medication Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-gray-300">
                  Medication Name *
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Metformin"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Dosage */}
              <div className="space-y-2">
                <Label htmlFor="dosage" className="dark:text-gray-300">
                  Dosage *
                </Label>
                <Input
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 500mg"
                  required
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Frequency */}
              <div className="space-y-2">
                <Label className="dark:text-gray-300">Frequency *</Label>
                <Select value={frequency} onValueChange={setFrequency} required>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((freq) => (
                      <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">

                {/* Start Date */}
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start font-normal text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {format(startDate, 'PP')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(d) => d && setStartDate(d)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label className="dark:text-gray-300">
                    End Date{' '}
                    <span className="text-gray-400 text-xs">(optional)</span>
                  </Label>
                  <div className="relative">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start font-normal text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                          {endDate ? format(endDate, 'PP') : 'No end date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {endDate && (
                      <button
                        type="button"
                        onClick={() => setEndDate(null)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Saving...
                  </div>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Add Medication</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
          <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2 text-sm">
            💊 Tips:
          </h3>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            <li>Tap a common medication above to quickly fill the name</li>
            <li>Include the exact dosage as prescribed by your doctor</li>
            <li>Leave end date empty for medications you currently take</li>
          </ul>
        </div>
      </div>
    </div>
  );
}