import React from 'react';
import {useDroppable} from '@dnd-kit/core';
import {ChevronLeft, ChevronRight, Trash2} from 'lucide-react';

export default function DroppableMoveZone({isActive, onMove, isLeft}) {
    const {setNodeRef, isOver} = useDroppable({
        id: isLeft ? 'move-left-zone' : 'move-right-zone',
        data: {type: isLeft ? 'move-left' : 'move-right'}
    });

    if (!isActive) return null;

    return (
        <div ref={setNodeRef} className={`absolute ${isLeft ? '-left-24' : '-right-24'} flex items-center h-full`}>
            <button
                onClick={onMove}
                className={`${isOver ? 'scale-110' : 'animate-pulse'} w-10 h-10 flex-shrink-0 bg-gray-600/50 rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-transform`}
            >
                {isLeft ? <ChevronLeft className="w-5 h-5 text-white"/> : <ChevronRight className="w-5 h-5 text-white"/>}
            </button>
        </div>
    );
}
