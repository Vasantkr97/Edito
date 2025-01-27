import { useCodeEditorStore } from '@/src/store/useCodeEditor';
import React, { useEffect, useRef, useState } from 'react'

const LanguageSelector = ({ hasAccess }: { hasAccess: Boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const{ language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const handleClickOutSide = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    };
    
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide)
  },[])

  return (
    <div>LanguageSelector</div>
  )
}

export default LanguageSelector