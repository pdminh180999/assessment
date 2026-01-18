import React from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ show, value, onChange, onKeyDown, themeClasses }) {
    if (!show) return null;

    const { dockBg, borderColor, textColor } = themeClasses;
    const isDark = themeClasses.cardBg === 'bg-gray-800';

    return (
        <div className="pointer-events-auto fixed bottom-36 left-1/2 -translate-x-1/2 z-30">
            <div className={`${dockBg} backdrop-blur-xl rounded-full px-6 py-3 border ${borderColor} shadow-xl w-80`}>
                <div className="flex items-center gap-3">
                    <Search className={`w-5 h-5 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder="Filter stacks"
                        className={`flex-1 bg-transparent ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'} outline-none`}
                        autoFocus
                    />
                </div>
            </div>
        </div>
    );
}
