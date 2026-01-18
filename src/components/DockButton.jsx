import React, {useEffect, useState} from 'react';
import {Plus, Search, Star, Minimize, ChevronLeft, ChevronRight} from 'lucide-react';
import StackItem from "./StackItem.jsx";

export default function DockButton({
                                       activeStack,
                                       stacks,
                                       filteredStacks,
                                       theme,
                                       onThemeToggle,
                                       onStackClick,
                                       onStackEdit,
                                       onStackDelete,
                                       onAddClick,
                                       onSearchClick,
                                       onClose,
                                       showSearch,
                                       themeClasses
                                   }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(
        window.innerWidth < 768 ? 3 : 6
    );

    useEffect(() => {
        const handleResize = () => {
            const newValue = window.innerWidth < 768 ? 3 : 6;
            setItemsPerPage(prev => {
                if (prev !== newValue) {
                    setCurrentPage(0); // reset page when layout changes
                    return newValue;
                }
                return prev;
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const ITEMS_PER_PAGE = itemsPerPage;
    const displayStacks = filteredStacks || stacks;
    const totalPages = Math.ceil(displayStacks.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const visibleStacks = displayStacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const {dockBg, borderColor} = themeClasses;
    const isDark = theme === 'dark';

    const handlePrevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
    };

    return (
        <div
            className={`${dockBg} backdrop-blur-xl rounded-3xl px-3 py-3 flex items-center gap-1 border ${borderColor} shadow-2xl`}>
            {/* Theme Toggle Button */}
            <div className="flex flex-col gap-1 relative items-center w-16 border-r border-white/15 pe-2">
                <button
                    onClick={onThemeToggle}
                    className={`w-14 h-14 ${isDark ? 'bg-gray-700' : 'bg-gray-500/80'} backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center hover:scale-105 transition-transform`}
                >
                    <Star className="w-5 h-5 text-white mb-0.5"/>
                </button>
                <span className="text-[10px] text-white font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className="w-12 h-4"
                         viewBox="0 0 399.3 101.2" aria-label="Plugilo logo"><path fill="currentColor"
                                                                                   d="M181.4 5.2h6.7v70.7h-6.7zM274.3 73.7c-9.8 0-17.8-10.2-17.8-22.8s8-22.8 17.8-22.8 17.8 10.2 17.8 22.8c.1 12.5-7.9 22.8-17.8 22.8m17.9-43.1c-4.5-5.7-10.8-9.3-17.8-9.3-13.5 0-24.5 13.2-24.5 29.5s11 29.5 24.5 29.5c7 0 13.3-3.6 17.8-9.3v1.8c0 14.2-5.6 18-15.2 19.5-12.8 1.2-16.9-5.8-17-6.1l-2.9 1.6-3 1.5c.2.4 5.2 9.7 20 9.7 1.1 0 2.4-.1 3.6-.2h.2c10-1.6 20.2-5.8 20.8-24.4V24.7H292v5.9zM234.4 64.2c-2.4 2.9-7.9 8.2-13.4 8.3-5 .1-8.4-.9-10.7-3.2-2.6-2.5-3.9-6.9-3.9-13V25.2h-6.7v31.2c0 8 2 13.9 5.9 17.7 3.5 3.4 8.3 5.1 14.8 5.1h.7c5.2-.1 9.9-2.8 13.3-5.6v4.9h6.7V25.2h-6.7zM310 25.2h6.7v50.1H310zM328.5 5.2h6.7v70.1h-6.7zM370.2 73.7c-10.4 0-18.8-10.2-18.8-22.8s8.4-22.8 18.8-22.8S389 38.2 389 50.8s-8.4 22.9-18.8 22.9m0-52.4c-14 0-25.5 13.2-25.5 29.5s11.4 29.5 25.5 29.5c14 0 25.5-13.2 25.5-29.5s-11.4-29.5-25.5-29.5M316.9 12.9c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6M85.5 47.5H74.2c-2-12.9-14-25.3-28.5-27.9-5.3-.9-7.9-1-13.8-1v12.8H9.6c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.3V60H9.7c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.2v13c5.9 0 10-.1 13.9-1.1C59.9 79.1 72.1 67.6 74.1 55h11.3zM148.3 73.7c-8.8 0-16.1-8.2-17.6-19V47c1.4-10.8 8.7-19 17.6-19 9.8 0 17.8 10.2 17.8 22.8s-8 22.9-17.8 22.9m0-52.4c-6.9 0-13.1 3.4-17.6 9v-5.6H124v70.6h6.7v-24c4.5 5.5 10.7 9 17.6 9 13.5 0 24.5-13.2 24.5-29.5s-11-29.5-24.5-29.5"></path></svg>
                </span>
            </div>

            {totalPages > 1 && (
                <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 0}
                    className={`w-4 h-10 flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-600/50'} rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform`}
                >
                    <ChevronLeft className="w-5 h-5 text-white"/>
                </button>
            )}

            {/* Stack Buttons */}
            <div className="flex items-center">
                {visibleStacks.length > 0 ? (
                    visibleStacks.map((stack) => {
                        return (
                            <StackItem
                                active={activeStack === stack.id}
                                key={stack.id}
                                stack={stack}
                                isDark={isDark}
                                onStackClick={onStackClick}
                                onEdit={onStackEdit}
                                onDelete={onStackDelete}
                                themeClasses={themeClasses}
                            />
                        );
                    })
                ) : (
                    <div className="px-4 py-2 text-white/70 text-sm">
                        No stacks found
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages - 1}
                    className={`w-4 h-10 flex-shrink-0 ${isDark ? 'bg-gray-700' : 'bg-gray-600/50'} rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform`}
                >
                    <ChevronRight className="w-5 h-5 text-white"/>
                </button>
            )}

            {/* Add Button */}
            <div className="flex flex-col gap-1 relative items-center w-16 border-l border-white/15 ps-2">
                <button
                    onClick={onAddClick}
                    className={`w-14 h-14 ${isDark ? 'bg-gray-700' : 'bg-gray-500/80'} rounded-2xl flex items-center justify-center hover:scale-105 transition-transform`}
                >
                    <Plus className="w-6 h-6 text-white"/>
                </button>
                <span className="h-4"></span>
            </div>

            <div className="items-end flex gap-1 self-end flex-col">
                {/* Search Button */}
                <button
                    onClick={onSearchClick}
                    className={`w-6 h-6 rounded-2xl flex items-center justify-center hover:scale-105 transition-all ${
                        showSearch ? 'bg-blue-600' : isDark ? 'bg-gray-700' : 'bg-white/10'
                    }`}
                >
                    <Search className="w-4 h-4 text-white"/>
                </button>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`w-6 h-6 rounded-2xl flex items-center justify-center hover:scale-105 transition-all ${
                        isDark ? 'bg-gray-700' : 'bg-white/10'
                    }`}
                >
                    <Minimize className="w-4 h-4 text-white"/>
                </button>
            </div>
        </div>
    );
}
