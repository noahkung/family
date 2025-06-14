import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/hooks/useLanguage';

// ไอคอน SVG รูปบ้าน
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

// ไอคอน SVG รูปเฟือง (Settings)
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// ไอคอน SVG รูปลูกศรชี้ลง
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
);


export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const [isClient, setIsClient] = useState(false);
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : ''
  );

  useEffect(() => {
    setIsClient(true);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    const intervalId = setInterval(handleLocationChange, 250);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      clearInterval(intervalId);
    };
  }, []);

  const isAdminPage = currentPath.startsWith('/admin');

  return (
    <div
      // เพิ่ม CSS Class นี้ในไฟล์ CSS หลักเพื่อแก้ปัญหากระตุกบน iOS
      // .language-switcher-container { transform: translateZ(0); }
      className="language-switcher-container fixed top-4 right-4 z-50 flex items-center space-x-2"
    >
      {/* เปลี่ยนมาใช้ไอคอน SVG ที่สร้างไว้ข้างบน */}
      {isAdminPage ? (
        <a href="/" title="กลับหน้าหลัก" className="text-slate-700 hover:text-black transition-colors duration-200 p-1">
          <HomeIcon />
        </a>
      ) : (
        <a href="/admin" title="Admin Login" className="text-slate-700 hover:text-black transition-colors duration-200 p-1">
          <SettingsIcon />
        </a>
      )}

      {/* ปุ่มเปลี่ยนภาษาแบบ Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[80px] bg-white/90">
            {isClient ? language.toUpperCase() : '...'}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white/95">
          <DropdownMenuItem onClick={() => setLanguage('en')}>
            <span className="w-5 mr-2">🇺🇸</span> English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('th')}>
            <span className="w-5 mr-2">🇹🇭</span> ไทย
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
