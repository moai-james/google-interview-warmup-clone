import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex space-x-2">
      <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'}>
        English
      </Button>
      <Button onClick={() => setLanguage('zh')} variant={language === 'zh' ? 'default' : 'outline'}>
        中文
      </Button>
    </div>
  );
};

export default LanguageSwitcher;