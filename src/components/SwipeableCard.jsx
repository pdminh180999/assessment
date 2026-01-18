import React from 'react';
import {useDraggable} from '@dnd-kit/core';
import {Pencil} from 'lucide-react';

export default function SwipeableCard({
                                              stackId,
                                              card,
                                              isDark,
                                              cardBg,
                                              cardText,
                                              cardSubtext,
                                              onEditCard,
                                              onClose,
                                              isActive = true,
                                              isDragging = false // passed from parent
                                          }) {

    const {attributes, listeners, setNodeRef} = useDraggable({
        id: `card-${card.id}`,
        data: {
            type: 'card',
            card: card
        },
        disabled: !isActive
    });

    return (
        <div
            ref={setNodeRef}
            {...(isActive ? listeners : {})}
            {...(isActive ? attributes : {})}
            className="relative cursor-grab active:cursor-grabbing"
            style={{
                opacity: isDragging ? 0.3 : 1, // Hide original card while dragging
                transition: 'opacity 0.2s ease',
            }}
        >
            <div className={`w-[226px] h-[360px] ${cardBg} rounded-3xl shadow-2xl overflow-hidden border-4 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
                <div className={`h-56 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                    {card.cover ? (
                        <img
                            src={card.cover}
                            alt={card.name}
                            className="w-full h-full object-cover pointer-events-none select-none"
                        />
                    ) : (
                        <div className="text-6xl pointer-events-none select-none">🖼️</div>
                    )}
                </div>
                <div className="relative p-6">
                    <h3 className={`text-xl font-bold ${cardText} select-none`}>
                        {card.name}
                    </h3>

                    {card.description && (
                        <p className={`text-sm ${cardSubtext} leading-relaxed select-none`}>
                            {card.description}
                        </p>
                    )}
                </div>
                <div className="absolute bottom-2 right-2">
                    <button className={`p-2 hover:${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}
                            onClick={() => {
                                onClose();
                                onEditCard(stackId, card);
                            }}
                    >
                        <Pencil className={`w-4 h-4 ${cardText}`}/>
                    </button>
                </div>
            </div>
        </div>
    );
}
