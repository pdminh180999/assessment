import React from 'react';

export default function CardOverlay({ card, isDark, dragState }) {
    const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
    const cardText = isDark ? 'text-white' : 'text-gray-900';
    const cardSubtext = isDark ? 'text-gray-400' : 'text-gray-600';

    const isOverDelete = dragState?.isOverDelete;
    const targetStack = dragState?.targetStack;
    const offsetY = dragState?.offsetY || 0;
    const isDraggingUp = offsetY < -50;

    return (
        <div
            className="cursor-grabbing"
            style={{
                transform: `scale(0.25)`,
                filter: isDraggingUp ? 'blur(2px)' : 'none',
                opacity: isDraggingUp ? 0.8 : 0.95,
            }}
        >
            <div className={`w-[226px] h-[360px] ${cardBg} rounded-3xl shadow-2xl overflow-hidden border-4 ${
                isOverDelete ? 'border-red-500' :
                    targetStack ? 'border-blue-500' :
                        isDark ? 'border-gray-700' : 'border-gray-200'} transition-colors`}>
                <div className={`h-56 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                    {card.cover ? (
                        <img
                            src={card.cover}
                            alt={card.name}
                            className="w-full h-full object-cover pointer-events-none select-none"
                            draggable="false"
                        />
                    ) : (
                        <div className="text-6xl pointer-events-none select-none">🖼️</div>
                    )}
                </div>
                <div className="p-6">
                    <h3 className={`text-xl font-bold ${cardText} select-none mb-2`}>
                        {card.name}
                    </h3>
                    {card.description && (
                        <p className={`text-sm ${cardSubtext} leading-relaxed select-none line-clamp-3`}>
                            {card.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
