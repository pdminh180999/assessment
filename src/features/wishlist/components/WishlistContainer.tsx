import React, { useEffect, useState } from 'react'
import { useWishlist } from '../hooks'
import { CardOverlay } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import { useStore } from '@/store'
import { Wishlist, WishlistItem } from '@/shared/types'
import { getThemeClasses } from '@/shared/constants'
import { DeleteZone, DndContainer, MoveZone } from '@/features/dnd/components'
import { Expand } from 'lucide-react'
import { useDragDrop } from '@/features/dnd/hooks'
import { CardZone } from '@/features/dnd/components/CardZone.tsx'
import { WishlistDock } from '@/features/wishlist/components/WishlistDock.tsx'
import { CreateWishlistModal } from '@/features/wishlist/components/CreateWishlistModal.tsx'
import { useToast } from '@/shared/components'
import { SearchBar } from '@/features/filter/components'
import { useSearch } from '@/features/filter/hooks'

interface WishlistContainerProps {
  theme: 'light' | 'dark'
}

export const WishlistContainer: React.FC<WishlistContainerProps> = ({ theme }) => {
  const [initialTheme, setInitialTheme] = useState<'light' | 'dark'>(theme)

  const isDark = initialTheme === 'dark'
  const themeClasses = getThemeClasses(isDark)
  const { dockBg, borderColor, textColor, cardBg, cardText, cardSubtext } = themeClasses

  const toast = useToast()
  const {
    isLoading,
    setLoading,
    isCreateModalOpen,
    setCreateModalOpen,
    isSearchOpen,
    setSearchOpen,
    isDockOpen,
    setDockOpen,
  } = useStore()
  const {
    wishlists,
    loadWishlists,
    currentWishlist,
    setCurrentWishlist,
    currentItem,
    setCurrentItem,
    createWishlist,
    updateWishlist,
    removeWishlist,
    createItem,
    updateItem,
    removeItem,
    relocateItem,
    swipeIndex,
    setSwipeIndex,
    swipeLeft,
    swipeRight,
  } = useWishlist()
  const {
    activeCard,
    dragState,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleDragCancel,
  } = useDragDrop({
    onDelete: removeItem,
    onSwipeLeft: swipeLeft,
    onSwipeRight: swipeRight,
    onMoveToStack: relocateItem,
  })
  const { searchQuery, setSearchQuery, filteredWishlists } = useSearch()

  useEffect(() => {
    const init = async () => {
      await loadWishlists()
      setLoading(false)
    }
    init()
  }, [])

  const toggleWishlist = (wishlist: Wishlist) => {
    if (currentWishlist && currentWishlist.id === wishlist.id) {
      setCurrentWishlist(null)
      setCurrentItem(null)
      setSwipeIndex(0)
    } else {
      if (wishlist.items.length > 0) {
        setCurrentWishlist(wishlist)
        setCurrentItem(wishlist.items[0] as WishlistItem)
        setSwipeIndex(0)
      } else {
        toast.error('No items in this wishlist')
      }
    }
  }

  const handleOpenEditWishlist = (wishlist: Wishlist) => {
    setCurrentWishlist(wishlist)
    setCreateModalOpen(true)
  }

  const handleOpenEditCard = (item: WishlistItem) => {
    setCurrentItem(item)
    setCreateModalOpen(true)
  }

  const renderDragOverlay = (card: WishlistItem) => (
    <CardOverlay card={card} isDark={isDark} dragState={dragState} />
  )

  if (isLoading) {
    return (
      <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-[178px] h-[46px]">
        <Skeleton variant="text" className="h-[46px] rounded-3xl" />
      </div>
    )
  }

  return (
    <>
      <DndContainer
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        activeCard={activeCard}
        renderOverlay={renderDragOverlay}
      >
        <div className="fixed bottom-0 right-0 left-0">
          {currentItem && currentWishlist && (
            <div className="pointer-events-auto">
              <DeleteZone isActive={dragState.isDragging} />

              <div className="relative w-[226px] h-[360px] left-1/2 -translate-x-1/2 -translate-y-3/4 z-50">
                <MoveZone isActive={dragState.isDragging} onMove={swipeLeft} isLeft />

                {currentWishlist.items.map((card, index) => {
                  const offset = index - swipeIndex
                  if (Math.abs(offset) > 2) return null

                  return (
                    <div key={card.id} className="absolute inset-0"
                         style={{
                           zIndex: currentWishlist.items.length - Math.abs(offset),
                           transform: `translateX(${offset * 12}px) translateY(${Math.abs(offset) * 8}px) rotate(${offset * 3}deg) scale(${1 - Math.abs(offset) * 0.05})`,
                           opacity: 1 - Math.abs(offset) * 0.25,
                           pointerEvents: offset === 0 ? 'auto' : 'none',
                           transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                         }}>
                      {offset === 0 ? (
                        <CardZone
                          card={card}
                          isDark={isDark}
                          cardBg={cardBg}
                          cardText={cardText}
                          cardSubtext={cardSubtext}
                          onEditCard={handleOpenEditCard}
                          onClose={() => {
                            setCurrentItem(null)
                            setCurrentWishlist(null)
                            setSwipeIndex(0)
                          }}
                          isActive={true}
                          isDragging={activeCard?.id === card.id}
                        />
                      ) : (
                        <div
                          className={`w-full h-full ${cardBg} rounded-3xl shadow-2xl border-4 ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
                          <div className={`h-56 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {card.imageUrl && (
                              <img src={card.imageUrl} alt={card.title}
                                   className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className={`text-xl font-bold ${cardText}`}>{card.title}</h3>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                <MoveZone isActive={dragState.isDragging} onMove={swipeRight} />
              </div>
            </div>
          )}

          {/* Dock Button */}
          <div className="pointer-events-auto fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
            {isDockOpen ? (
              <WishlistDock
                activeStackId={currentWishlist ? currentWishlist.id : ''}
                stacks={filteredWishlists}
                theme={initialTheme}
                onThemeToggle={() => setInitialTheme(initialTheme === 'light' ? 'dark' : 'light')}
                onStackClick={toggleWishlist}
                onStackEdit={handleOpenEditWishlist}
                onStackDelete={removeWishlist}
                onAddClick={() => {
                  setCurrentItem(null)
                  setCurrentWishlist(null)
                  setSwipeIndex(0)
                  setCreateModalOpen(true)
                }}
                onSearchClick={() => setSearchOpen(!isSearchOpen)}
                onClose={() => {
                  setDockOpen(false)
                  setSearchOpen(false)
                  setCurrentItem(null)
                  setCurrentWishlist(null)
                  setSwipeIndex(0)
                }}
                showSearch={isSearchOpen}
              />
            ) : (
              <button
                onClick={() => {
                  setDockOpen(true)
                  if (searchQuery) {
                    setSearchOpen(true)
                  }
                }}
                className={`${dockBg} backdrop-blur-xl rounded-full px-5 py-3 border ${borderColor} shadow-xl hover:${isDark ? 'bg-gray-800/80' : 'bg-white/20'} transition-all flex items-center gap-3`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve"
                     className={`${textColor} w-14`}
                     viewBox="0 0 399.3 101.2" aria-label="Plugilo logo">
                  <path fill="currentColor"
                        d="M181.4 5.2h6.7v70.7h-6.7zM274.3 73.7c-9.8 0-17.8-10.2-17.8-22.8s8-22.8 17.8-22.8 17.8 10.2 17.8 22.8c.1 12.5-7.9 22.8-17.8 22.8m17.9-43.1c-4.5-5.7-10.8-9.3-17.8-9.3-13.5 0-24.5 13.2-24.5 29.5s11 29.5 24.5 29.5c7 0 13.3-3.6 17.8-9.3v1.8c0 14.2-5.6 18-15.2 19.5-12.8 1.2-16.9-5.8-17-6.1l-2.9 1.6-3 1.5c.2.4 5.2 9.7 20 9.7 1.1 0 2.4-.1 3.6-.2h.2c10-1.6 20.2-5.8 20.8-24.4V24.7H292v5.9zM234.4 64.2c-2.4 2.9-7.9 8.2-13.4 8.3-5 .1-8.4-.9-10.7-3.2-2.6-2.5-3.9-6.9-3.9-13V25.2h-6.7v31.2c0 8 2 13.9 5.9 17.7 3.5 3.4 8.3 5.1 14.8 5.1h.7c5.2-.1 9.9-2.8 13.3-5.6v4.9h6.7V25.2h-6.7zM310 25.2h6.7v50.1H310zM328.5 5.2h6.7v70.1h-6.7zM370.2 73.7c-10.4 0-18.8-10.2-18.8-22.8s8.4-22.8 18.8-22.8S389 38.2 389 50.8s-8.4 22.9-18.8 22.9m0-52.4c-14 0-25.5 13.2-25.5 29.5s11.4 29.5 25.5 29.5c14 0 25.5-13.2 25.5-29.5s-11.4-29.5-25.5-29.5M316.9 12.9c0 2-1.6 3.6-3.6 3.6s-3.6-1.6-3.6-3.6 1.6-3.6 3.6-3.6 3.6 1.6 3.6 3.6M85.5 47.5H74.2c-2-12.9-14-25.3-28.5-27.9-5.3-.9-7.9-1-13.8-1v12.8H9.6c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.3V60H9.7c-2.9 0-5.3 2.4-5.3 5.4s2.4 5.4 5.3 5.4h22.2v13c5.9 0 10-.1 13.9-1.1C59.9 79.1 72.1 67.6 74.1 55h11.3zM148.3 73.7c-8.8 0-16.1-8.2-17.6-19V47c1.4-10.8 8.7-19 17.6-19 9.8 0 17.8 10.2 17.8 22.8s-8 22.9-17.8 22.9m0-52.4c-6.9 0-13.1 3.4-17.6 9v-5.6H124v70.6h6.7v-24c4.5 5.5 10.7 9 17.6 9 13.5 0 24.5-13.2 24.5-29.5s-11-29.5-24.5-29.5"></path>
                </svg>
                <span
                  className={`${isDark ? 'text-gray-400' : 'text-white/70'} text-sm`}>{wishlists.length} stacks</span>
                <Expand className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-white/70'}`} />
              </button>
            )}
          </div>
        </div>
      </DndContainer>

      <CreateWishlistModal
        stacks={wishlists}
        stack={currentWishlist}
        card={currentItem}
        show={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateCard={createItem}
        onEditCard={updateItem}
        onCreateStack={createWishlist}
        onEditStack={updateWishlist}
        theme={initialTheme}
      />

      <SearchBar
        show={isSearchOpen && isDockOpen}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setSearchQuery('')
            setSearchOpen(false)
          }
        }}
        theme={initialTheme}
      />
    </>
  )
}
