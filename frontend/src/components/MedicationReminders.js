'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pill } from 'lucide-react';

export default function MedicationReminders({ medications = [] }) {
    const [remindersSet, setRemindersSet] = useState(false);

    useEffect(() => {
        if (!medications || medications.length === 0 || remindersSet) return;

        // In a real app, this would use Service Workers for push notifications
        // or calculate exact times based on user preferences.
        // For this demonstration, we simulate scheduling a reminder if they have active meds.

        const activeMeds = medications.filter(m => m.is_current);

        if (activeMeds.length > 0) {
            if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }

            // Simulate a reminder popping up in 5 seconds
            const timer = setTimeout(() => {
                const med = activeMeds[0];

                toast((t) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '36px', height: '36px', background: '#f3e8ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Pill size={18} color="#7c3aed" />
                        </div>
                        <div>
                            <p style={{ margin: '0 0 2px', fontWeight: 'bold', fontSize: '14px', color: '#0f172a' }}>
                                Time for medication!
                            </p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                Take your {med.name} ({med.dosage})
                            </p>
                        </div>
                        <button onClick={() => { toast.dismiss(t.id); toast.success('Marked as taken!'); }}
                            style={{ marginLeft: '10px', padding: '6px 12px', background: '#7c3aed', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Take
                        </button>
                    </div>
                ), { duration: 10000, position: 'top-center' });

            }, 5000);

            setRemindersSet(true);
            return () => clearTimeout(timer);
        }
    }, [medications, remindersSet]);

    return null; // This component handles side effects only
}
