'use client';

import { useTranslation } from 'react-i18next';
import '../../i18n'; // Import directly

export default function TestI18nPage() {
  const { t, i18n } = useTranslation();
  
  console.log('🔍 i18n instance:', i18n);
  console.log('🔍 changeLanguage type:', typeof i18n?.changeLanguage);
  
  const changeLanguage = (lang) => {
    console.log('🟡 Attempting to change to:', lang);
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lang);
      console.log('✅ Language changed to:', lang);
    } else {
      console.error('❌ i18n.changeLanguage is not a function');
      console.log('i18n object:', i18n);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">i18n Test Page</h1>
      <p>Current language: {i18n?.language || 'unknown'}</p>
      <p>Translation test: {t('app_name')}</p>
      
      <div className="mt-4 space-x-2">
        <button 
          onClick={() => changeLanguage('en')}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          English
        </button>
        <button 
          onClick={() => changeLanguage('hi')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          हिन्दी
        </button>
      </div>
    </div>
  );
}
