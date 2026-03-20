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
import { Calendar as CalendarIcon, ArrowLeft, Save, Coffee } from 'lucide-react';
import { saveMealLog } from '@/services/mealLogs';
import toast from 'react-hot-toast';

export default function LogMealPage() {
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [mealType, setMealType] = useState('Breakfast');
    const [carbs, setCarbs] = useState('');
    const [calories, setCalories] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!carbs || isNaN(parseInt(carbs))) {
            toast.error('Please enter valid carbohydrates');
            return;
        }
        setSaving(true);
        try {
            await saveMealLog({
                meal_type: mealType,
                carbohydrates_g: parseInt(carbs),
                calories: calories ? parseInt(calories) : null,
                recorded_at: date.toISOString(),
                notes
            });
            toast.success('Meal logged successfully!');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error?.error || 'Failed to log meal');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-white hover:bg-white/20">
                            <ArrowLeft className="h-4 w-4 mr-1" /> Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold">Log a Meal</h1>
                            <p className="text-orange-100 text-xs">Track your carbs and nutrition</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 dark:text-white">
                            <Coffee className="h-5 w-5 text-orange-500" />
                            Meal Details
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
                                <Label className="dark:text-gray-300">Meal Type</Label>
                                <select
                                    value={mealType}
                                    onChange={(e) => setMealType(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Snack">Snack</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="carbs" className="dark:text-gray-300">Carbs (g)</Label>
                                    <Input type="number" id="carbs" required value={carbs} onChange={(e) => setCarbs(e.target.value)} placeholder="e.g. 45" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="calories" className="dark:text-gray-300">Calories (kcal)</Label>
                                    <Input type="number" id="calories" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="e.g. 350" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes" className="dark:text-gray-300">Notes (Optional)</Label>
                                <textarea id="notes" rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What did you eat?" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none text-sm" />
                            </div>

                            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={saving || !carbs}>
                                {saving ? "Saving..." : <><Save className="h-4 w-4 mr-2" /> Save Meal</>}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
