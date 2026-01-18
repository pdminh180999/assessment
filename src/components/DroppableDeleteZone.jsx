import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

export default function DroppableDeleteZone({ isActive }) {
    const { setNodeRef, isOver } = useDroppable({
        id: 'delete-zone',
        data: { type: 'delete' }
    });

    if (!isActive) return null;

    return (
        <div
            ref={setNodeRef}
            className="fixed top-0 left-0 right-0 h-40 z-40 flex items-start justify-center pt-8 pointer-events-auto"
        >
            <div className={`${isOver ? 'bg-red-600 scale-110' : 'bg-red-500/90'} backdrop-blur-sm rounded-full p-6 shadow-2xl transition-all ${isOver ? '' : 'animate-pulse'}`}>
                <Trash2 className="w-8 h-8 text-white" />
            </div>
            <p className={`absolute top-28 text-white text-sm font-semibold ${isOver ? 'scale-110' : ''} transition-transform`}>
                {isOver ? 'Release to delete' : 'Drag here to delete'}
            </p>
        </div>
    );
}
