import React, {useEffect, useMemo, useReducer, useState} from 'react';
import {Expand} from 'lucide-react';
import {mockAPI} from '../api/mockAPI';
import {ACTIONS, initialState, wishlistReducer} from '../state/reducer';
import {getThemeClasses} from '../utils/constants';
import SwipeableCard from './SwipeableCard';
import CreateMenu from './CreateMenu';
import SearchBar from './SearchBar';
import DockButton from './DockButton';
import DndWrapper from "./DndWrapper.jsx";
import DroppableDeleteZone from "./DroppableDeleteZone";
import CardOverlay from "./CardOverlay";

export default function WishlistDock() {
    const [state, dispatch] = useReducer(wishlistReducer, initialState);
    const [isDockOpen, setIsDockOpen] = useState(false);
    const [editStack, setEditStack] = useState(null);
    const [editCard, setEditCard] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSwipeCard, setCurrentSwipeCard] = useState(null);
    const [currentSwipeStack, setCurrentSwipeStack] = useState(null);
    const [updatedCurrentStack, setUpdatedCurrentStack] = useState([]);
    const [swipeIndex, setSwipeIndex] = useState(0);
    const [theme, setTheme] = useState('light');

    const [activeCard, setActiveCard] = useState(null);
    const [dragState, setDragState] = useState({
        isDragging: false,
        isOverDelete: false,
        targetStack: null,
        offsetX: 0,
        offsetY: 0
    });

    useEffect(() => {
        loadStacks();
    }, []);

    const loadStacks = async () => {
        try {
            dispatch({type: ACTIONS.SET_LOADING, payload: true});
            const stacks = await mockAPI.getStacks();
            dispatch({type: ACTIONS.SET_STACKS, payload: stacks});
        } catch (error) {
            dispatch({type: ACTIONS.SET_ERROR, payload: error.message});
        }
    };

    const handleCreateStack = async (stackData) => {
        try {
            const newStack = await mockAPI.createStack(stackData);
            dispatch({type: ACTIONS.ADD_STACK, payload: newStack});
        } catch (error) {
            console.error('Failed to create stack:', error);
        }
    };

    const handleEditStack = async (stackId, stackData) => {
        try {
            const updatedStack = await mockAPI.updateStack(stackId, stackData);
            dispatch({type: ACTIONS.UPDATE_STACK, payload: updatedStack});
        } catch (error) {
            console.error('Failed to create stack:', error);
        }
    };

    const handleDeleteStack = async (stackId) => {
        try {
            if (!state.stacks.length || !stackId) return;
            await mockAPI.deleteStack(stackId);
            dispatch({type: ACTIONS.DELETE_STACK, payload: stackId});
        } catch (error) {
            console.error('Failed to delete stack:', error);
        }
    }

    const handleCreateCard = async (stackId, cardData) => {
        try {
            if (!state.stacks.length) return;
            const newCard = await mockAPI.addCard(stackId, cardData);
            dispatch({type: ACTIONS.ADD_CARD, payload: {stackId, card: newCard}});
        } catch (error) {
            console.error('Failed to create card:', error);
        }
    };

    const handleEditCard = async (stackId, cardId, cardData) => {
        try {
            if (!state.stacks.length) return;
            const newCard = await mockAPI.updateCard(stackId, cardId, cardData);
            dispatch({type: ACTIONS.UPDATE_CARD, payload: {stackId, cardId, card: newCard}});
        } catch (error) {
            console.error('Failed to create card:', error);
        }
    };

    const toggleStackCards = (stack) => {
        if (currentSwipeStack && currentSwipeStack.id === stack.id) {
            setCurrentSwipeCard(null);
            setCurrentSwipeStack(null);
            setSwipeIndex(0);
        } else {
            if (stack.cards.length > 0) {
                setCurrentSwipeStack(stack);
                setCurrentSwipeCard(stack.cards[0]);
                setSwipeIndex(0);
            }
        }
    };

    const handleOpenEditCard = (stackId, card) => {
        setEditCard({stackId, ...card});
        setShowCreateMenu(true);
    }

    const handleOpenEditStack = (stack) => {
        setEditStack(stack);
        setShowCreateMenu(true);
    }

    const handleSwipeLeft = () => {
        if (!currentSwipeStack || currentSwipeStack.cards.length === 0) return;

        const nextIndex = (swipeIndex + 1) % currentSwipeStack.cards.length;
        setSwipeIndex(nextIndex);
        setCurrentSwipeCard(currentSwipeStack.cards[nextIndex]);
    };

    const handleSwipeRight = () => {
        if (!currentSwipeStack || currentSwipeStack.cards.length === 0) return;

        const prevIndex =
            (swipeIndex - 1 + currentSwipeStack.cards.length) %
            currentSwipeStack.cards.length;
        setSwipeIndex(prevIndex);
        setCurrentSwipeCard(currentSwipeStack.cards[prevIndex]);
    };

    const handleDeleteCardFromSwipe = async (cardId) => {
        if (!currentSwipeStack) return;

        try {
            await mockAPI.deleteCard(currentSwipeStack.id, cardId);
            dispatch({
                type: ACTIONS.DELETE_CARD,
                payload: { stackId: currentSwipeStack.id, cardId }
            });

            const remainingCards = updatedCurrentStack.cards.filter(c => c.id !== cardId);
            if (remainingCards.length > 0) {
                const newIndex = Math.min(swipeIndex, remainingCards.length - 1);
                setSwipeIndex(newIndex);
                setCurrentSwipeCard(remainingCards[newIndex]);
            } else {
                setCurrentSwipeCard(null);
                setCurrentSwipeStack(null);
                setSwipeIndex(0);
            }
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    };

    const handleDragStart = (event) => {
        const card = event.active.data.current.card;
        setActiveCard(card);
        setDragState(prev => ({ ...prev, isDragging: true }));
    };

    const handleDragMove = (event) => {
        const { over, delta } = event;

        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            if (delta.x > 100) handleSwipeRight();
            if (delta.x < -100) handleSwipeLeft();
        }
        console.log(delta.x, delta.y);

        setDragState(prev => ({
            ...prev,
            isOverDelete: over?.id === 'delete-zone',
            targetStack: over?.data?.current?.type === 'stack' ? over.data.current.stack : null,
            offsetX: delta.x,
            offsetY: delta.y
        }));
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;

        const cardId = active.data.current.card?.id;

        // Delete card
        if (over?.id === 'delete-zone') {
            await handleDeleteCardFromSwipe(cardId);
        }
        // Move to stack
        else if (over?.data?.current?.type === 'stack') {
            const toStack = over.data.current.stack;
            if (toStack.id !== currentSwipeStack.id) {
                try {
                    await mockAPI.moveCard(currentSwipeStack.id, toStack.id, cardId);
                    dispatch({
                        type: ACTIONS.MOVE_CARD,
                        payload: {
                            fromStackId: currentSwipeStack.id,
                            toStackId: toStack.id,
                            cardId
                        }
                    });

                    setCurrentSwipeCard(null);
                    setCurrentSwipeStack(null);
                    setSwipeIndex(0);
                } catch (error) {
                    console.error('Failed to move card:', error);
                }
            }
        }

        // Reset
        setActiveCard(null);
        setDragState({
            isDragging: false,
            isOverDelete: false,
            targetStack: null,
            offsetX: 0,
            offsetY: 0
        });
    };

    const handleDragCancel = () => {
        setActiveCard(null);
        setDragState({
            isDragging: false,
            isOverDelete: false,
            targetStack: null,
            offsetX: 0,
            offsetY: 0
        });
    };

    const filteredStacks = useMemo(() => {
        if (!searchQuery.trim()) return null;

        return state.stacks.filter(stack =>
            stack.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [state.stacks, searchQuery]);

    const themeClasses = getThemeClasses(theme === 'dark');
    const {dockBg, borderColor, textColor, cardBg, cardText, cardSubtext} = themeClasses;
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!currentSwipeStack) {
            setUpdatedCurrentStack(null);
            return;
        }

        const updatedStack = state.stacks.find(s => s.id === currentSwipeStack.id);
        setUpdatedCurrentStack(updatedStack || null);
    }, [state.stacks, currentSwipeStack]);

    const renderDragOverlay = (card) => (
        <CardOverlay
            card={card}
            isDark={isDark}
            dragState={dragState}
        />
    );

    return (
        <DndWrapper
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
            activeCard={activeCard}
            renderOverlay={renderDragOverlay}
        >
        <div className="fixed bottom-0 right-0 left-0">
            {currentSwipeCard && updatedCurrentStack && (
                <div className="pointer-events-auto">
                    <DroppableDeleteZone isActive={dragState.isDragging} />

                    <div className="relative w-[226px] h-[360px] left-1/2 -translate-x-1/2 -translate-y-3/4 z-50">
                        {updatedCurrentStack.cards.map((card, index) => {
                            const offset = index - swipeIndex;
                            const isVisible = Math.abs(offset) <= 2;

                            if (!isVisible) return null;

                            return (
                                <div
                                    key={card.id}
                                    className="absolute inset-0"
                                    style={{
                                        zIndex: updatedCurrentStack.cards.length - Math.abs(offset),
                                        transform: `translateX(${offset * 12}px) translateY(${Math.abs(offset) * 8}px) rotate(${offset * 3}deg) scale(${1 - Math.abs(offset) * 0.05})`,
                                        opacity: 1 - Math.abs(offset) * 0.25,
                                        pointerEvents: offset === 0 ? 'auto' : 'none',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {offset === 0 ? (
                                        <SwipeableCard
                                            stackId={currentSwipeStack.id}
                                            card={card}
                                            isDark={isDark}
                                            cardBg={cardBg}
                                            cardText={cardText}
                                            cardSubtext={cardSubtext}
                                            onEditCard={handleOpenEditCard}
                                            onClose={() => {
                                                setCurrentSwipeCard(null);
                                                setCurrentSwipeStack(null);
                                                setSwipeIndex(0);
                                            }}
                                            onSwipeLeft={handleSwipeLeft}
                                            onSwipeRight={handleSwipeRight}
                                            isActive={true}
                                            isDragging={activeCard?.id === card.id}
                                        />
                                    ) : (
                                        <div
                                            className={`w-full h-full ${cardBg} rounded-3xl shadow-2xl border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                                            <div className={`h-56 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                                {card.cover && (
                                                    <img src={card.cover} alt={card.name}
                                                         className="w-full h-full object-cover"/>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <h3 className={`text-xl font-bold ${cardText}`}>{card.name}</h3>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Create Menu */}
            <CreateMenu
                stacks={state.stacks}
                stack={editStack}
                card={editCard}
                show={showCreateMenu}
                onClose={() => {
                    setEditStack(null);
                    setEditCard(null);
                    setShowCreateMenu(false);
                }}
                onCreateCard={handleCreateCard}
                onEditCard={handleEditCard}
                onCreateStack={handleCreateStack}
                onEditStack={handleEditStack}
                themeClasses={themeClasses}
            />

            {/* Search Bar */}
            <SearchBar
                show={showSearch && isDockOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        setShowSearch(false);
                        setSearchQuery("");
                    }
                }}
                themeClasses={themeClasses}
            />

            {/* Main Dock */}
            <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
                {isDockOpen ? (
                    <DockButton
                        activeStack={currentSwipeStack ? currentSwipeStack.id : ''}
                        stacks={state.stacks}
                        filteredStacks={filteredStacks}
                        theme={theme}
                        onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                        onStackClick={toggleStackCards}
                        onStackEdit={handleOpenEditStack}
                        onStackDelete={handleDeleteStack}
                        onAddClick={() => {
                            setCurrentSwipeCard(null);
                            setCurrentSwipeStack(null);
                            setSwipeIndex(0);
                            setShowCreateMenu(true);
                        }}
                        onSearchClick={() => setShowSearch(!showSearch)}
                        onClose={() => {
                            setIsDockOpen(false);
                            setShowSearch(false);
                            setSearchQuery('');
                        }}
                        showSearch={showSearch}
                        themeClasses={themeClasses}
                    />
                ) : (
                    <button
                        onClick={() => setIsDockOpen(true)}
                        className={`${dockBg} backdrop-blur-xl rounded-full px-5 py-3 border ${borderColor} shadow-xl hover:${isDark ? 'bg-gray-800/80' : 'bg-white/20'} transition-all flex items-center gap-3`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" className={`${textColor} w-14`}
                             viewBox="0 0 399.3 101.2" aria-label="Plugilo logo">
                            <path fill="currentColor"
                                  d="M181.4 5.2h6.7v70.7h-6.7zM274.3 73.7c-9.8 0-17.8-10.2-17.8-22.8s8-22.8 17.8-22.8 17.8 10.2 17.8 22.8c.1 12.5-7.9 22.8-17.8 22.8m17.9-43.1c-4.5-5.7-10.8-9.3-17.8-9.3-13.5 0-24.5 13.2-24.5 29.5s11 29.5 24.5 29.5c7 0 13.3-3.6 17.8-9.3v1.8c0 14.2-5.6 18-15.2 19.5-12.8 1.2-16.9-5.8-17-6.1l-2.9 1.6-3 1.5c.2.4 5.2 9.7 20 9.7 1.1 0 2.4-.1 3.6-.2h.2c10-1.6 20.2-5.8 20.8-24.4V24.7H292v5.9zM234.4 64.2c-2.4 2.9-7.9 8.2-13.4 8.3-5 .1-8.4-.9-10.7-3.2-2.6-2.5-3.9-6.9-3.9-13V25.2h-6.7v31.2c0 8 2 13.9 5.9 17.7 3.5 3.4 8.3 5.1 14.8 5.1h.7c5.2-.1 9.9-2.8 13.3-5.6v4.9h6.7V25.2h-6.7zM310 25.2h6.7v50.1H310zM328.5 5.2h6.7v70.1h-6.7zM370.2 73.7c-10.4 0-18.8-10.2-18.8-22.8s8.4-22.8 18.8-22.8S389 38.2 389 50.8s-8.4 22.9-18.8 22.9m0-52.4c-14 0-25.5 13.2-25.5 29.5s11.4 29.5 25.5 29.5c14 0 25.5-13.2 25.5-29.5s-11.4-29.5-25.5-29.5M316.9 12.9c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6M85.5 47.5H74.2c-2-12.9-14-25.3-28.5-27.9-5.3-.9-7.9-1-13.8-1v12.8H9.6c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.3V60H9.7c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.2v13c5.9 0 10-.1 13.9-1.1C59.9 79.1 72.1 67.6 74.1 55h11.3zM148.3 73.7c-8.8 0-16.1-8.2-17.6-19V47c1.4-10.8 8.7-19 17.6-19 9.8 0 17.8 10.2 17.8 22.8s-8 22.9-17.8 22.9m0-52.4c-6.9 0-13.1 3.4-17.6 9v-5.6H124v70.6h6.7v-24c4.5 5.5 10.7 9 17.6 9 13.5 0 24.5-13.2 24.5-29.5s-11-29.5-24.5-29.5"></path>
                        </svg>
                        <span
                            className={`${isDark ? 'text-gray-400' : 'text-white/70'} text-sm`}>{state.stacks.length} stacks</span>
                        <Expand className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-white/70'}`}/>
                    </button>
                )}
            </div>
        </div>
        </DndWrapper>
    );
}