import { Flame, Info, Coffee, Activity } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GamificationBanner({ streak }) {
    const router = useRouter();

    const displayStreak = streak || 0;

    return (
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-5 mb-5 shadow-md flex flex-col md:flex-row items-center justify-between gap-4 text-white relative overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="absolute -right-4 -top-8 text-white/10 pointer-events-none">
                <Flame size={120} />
            </div>

            <div className="flex items-center gap-4 z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <Flame size={24} className="text-yellow-300" />
                </div>
                <div>
                    <div>
                        <h3 className="font-extrabold text-xl m-0 tracking-tight flex items-center gap-2">
                            {displayStreak} Day Streak! 🔥
                        </h3>
                        <p className="text-white/80 text-[13px] m-0 leading-relaxed font-medium">
                            Log your meals, activities, or readings daily to keep the fire alive!
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 z-10 w-full md:w-auto">
                <button
                    onClick={() => router.push('/log-meal')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white text-orange-600 px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer hover:bg-orange-50 transition-colors shadow-sm"
                >
                    <Coffee size={15} /> Log Meal
                </button>
                <button
                    onClick={() => router.push('/log-activity')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-white/20 backdrop-blur-sm text-white border-white/40 border-[1px] px-4 py-2 rounded-xl text-[13px] font-bold cursor-pointer hover:bg-white/30 transition-colors shadow-sm"
                >
                    <Activity size={15} /> Log Activity
                </button>
            </div>
        </div>
    );
}
