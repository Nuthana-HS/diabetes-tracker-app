'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Button } from './ui/button';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-white hover:bg-white/20 text-transparent pointer-events-none"
        aria-label="Toggle theme"
      >
        <Moon className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="text-white hover:bg-white/20"
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-label="Toggle theme"
    >
      {theme === 'light'
        ? <Moon className="h-4 w-4" />
        : <Sun className="h-4 w-4" />
      }
    </Button>
  );
}