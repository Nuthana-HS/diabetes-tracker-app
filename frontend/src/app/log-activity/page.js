'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ArrowLeft, Save, Activity } from 'lucide-react';
import { saveActivityLog } from '@/services/activityLogs';
import toast from 'react-hot-toast';

export default function LogActivityPage() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [activityType, setActivityType] = useState('Walking');
    const [duration, setDuration] = useState('');
    const [intensity, setIntensity] = useState('Medium');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!duration || isNaN(parseInt(duration))) {
            toast.error('Please enter valid duration in minutes');
            return;
        }
        setSaving(true);
        try {
            await saveActivityLog({
                activity_type: activityType,
                duration_minutes: parseInt(duration),
                intensity,
                recorded_at: date.toISOString(),
                notes
            });
            toast.success('Activity logged successfully!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error?.error || 'Failed to log activity');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/20">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Log an Activity</h1>
                            <p className="text-emerald-100 text-xs">Track your exercise and fitness</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Activity className="h-5 w-5 text-emerald-500" />
                            Exercise Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label className="dark:text-gray-300">Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start font-normal dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {format(date, 'PPP')}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label className="dark:text-gray-300">Activity Type</Label>
                                <select
                                    value={activityType}
                                    onChange={(e) => setActivityType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Walking">Walking</option>
                                    <option value="Running">Running</option>
                                    <option value="Cycling">Cycling</option>
                                    <option value="Swimming">Swimming</option>
                                    <option value="Yoga">Yoga</option>
                                    <option value="Weightlifting">Weight Training</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration" className="dark:text-gray-300">Duration (mins)</Label>
                                    <Input type="number" id="duration" required value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 30" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="dark:text-gray-300">Intensity</Label>
                                    <select
                                        value={intensity}
                                        onChange={(e) => setIntensity(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="dark:text-gray-300">Notes (Optional)</Label>
                                <textarea id="notes" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did you feel?" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none text-sm" />
                            </div>

                            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={saving || !duration}>
                                {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Activity</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
