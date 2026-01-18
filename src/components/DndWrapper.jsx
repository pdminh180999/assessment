import React from 'react';
import {
    DndContext,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';

export default function DndWrapper({
                                       children,
                                       onDragStart,
                                       onDragMove,
                                       onDragEnd,
                                       onDragCancel,
                                       activeCard,
                                       renderOverlay
                                   }) {
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10,
        },
    });

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 100,
            tolerance: 5,
        },
    });

    const sensors = useSensors(mouseSensor, touchSensor);

    return (
        <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
        >
            {children}

            <DragOverlay
                dropAnimation={{
                    duration: 300,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                {activeCard ? renderOverlay?.(activeCard) : null}
            </DragOverlay>
        </DndContext>
    );
}