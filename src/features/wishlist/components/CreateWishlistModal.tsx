import React, { useEffect, useState } from 'react'
import { X, FileText, Layers, Image } from 'lucide-react'
import { Wishlist, WishlistItem } from '@/shared/types'
import { generateCover, isValidUrl } from '@/shared/utils'
import { getThemeClasses } from '@/shared/constants'

interface CreateWishlistModalProps {
  stacks: Wishlist[];
  stack?: Wishlist | null;
  card?: WishlistItem | null;
  show: boolean;
  onClose: () => void;
  onCreateCard: (wishlistId: string, item: Omit<WishlistItem, 'id' | 'createdAt'>) => void;
  onEditCard: (stackId: string, cardId: string, data: Partial<WishlistItem>) => void;
  onCreateStack: (data: Omit<Wishlist, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditStack: (stackId: string, data: Partial<Wishlist>) => void;
  theme: string
}

export const CreateWishlistModal: React.FC<CreateWishlistModalProps> = ({
                                                                          stacks,
                                                                          stack,
                                                                          card,
                                                                          show,
                                                                          onClose,
                                                                          onCreateCard,
                                                                          onEditCard,
                                                                          onCreateStack,
                                                                          onEditStack,
                                                                          theme,
                                                                        }) => {
  const [showCardForm, setShowCardForm] = useState<boolean>(false)
  const [showStackForm, setShowStackForm] = useState<boolean>(false)

  const [cardName, setCardName] = useState<string>('')
  const [cardUrl, setCardUrl] = useState<string>('')
  const [cardDescription, setCardDescription] = useState<string>('')
  const [cardStackId, setCardStackId] = useState<string>('')

  const [stackName, setStackName] = useState<string>('')
  const [stackCover, setStackCover] = useState<string>(generateCover())

  useEffect(() => {
    setShowStackForm(!!stack?.id)
    setStackName(stack?.name ?? '')
    setStackCover(stack?.cover ?? generateCover())
  }, [stack])

  useEffect(() => {
    setShowCardForm(!!card?.id)
    setCardName(card?.title ?? '')
    setCardUrl(card?.imageUrl ?? '')
    setCardDescription(card?.description ?? '')
    setCardStackId(card?.wishlistId ?? '')
  }, [card])

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault()

    onCreateCard(cardStackId, {
      title: cardName,
      imageUrl: cardUrl || `https://ui-avatars.com/api/?name=${cardName}&size=400&background=random`,
      description: cardDescription,
      wishlistId: cardStackId,
    })

    setCardName('');
    setCardUrl('');
    setCardDescription('');
    setCardStackId('');
    setShowCardForm(false);
    onClose()
  }

  const handleEditCard = (e: React.FormEvent) => {
    e.preventDefault()

    if (!card) return

    onEditCard(cardStackId, card.id, {
      title: cardName,
      imageUrl: cardUrl || `https://ui-avatars.com/api/?name=${cardName}&size=400&background=random`,
      description: cardDescription,
      wishlistId: cardStackId,
    })

    setCardName('');
    setCardUrl('');
    setCardDescription('');
    setCardStackId('');
    setShowCardForm(false);
    onClose()
  }

  const handleCreateStack = (e: React.FormEvent) => {
    e.preventDefault()

    onCreateStack({
      name: stackName,
      cover: stackCover,
      items: [],
    })

    setStackName('');
    setShowStackForm(false);
    onClose()
  }

  const handleEditStack = (e: React.FormEvent) => {
    e.preventDefault()

    if (!stack) return

    onEditStack(stack.id, {
      name: stackName,
      cover: stackCover,
    })

    setStackName('');
    setShowStackForm(false);
    onClose()
  }

  if (!show) return null

  const isDark = theme === 'dark'
  const themeClasses = getThemeClasses(isDark)
  const { bgOverlay, modalBg, inputBg, borderColor, textColor } = themeClasses

  return (
    <div
      className={`pointer-events-auto fixed inset-0 flex items-center justify-center z-40 ${bgOverlay} backdrop-blur-md`}>
      <div className={`${modalBg} backdrop-blur-xl rounded-3xl p-6 w-96 border ${borderColor} shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${textColor}`}>
            {showCardForm ? (card ? 'Edit Card' : 'Create Card') : showStackForm ? (stack ? 'Edit Stack' : 'Create Stack') : 'Create New'}
          </h3>
          <button
            onClick={() => {
              setStackName('')
              setShowStackForm(false)
              setCardName('')
              setCardUrl('')
              setCardDescription('')
              setCardStackId('')
              setShowCardForm(false)
              onClose()
            }}
            className={`p-2 hover:${inputBg} rounded-lg`}
          >
            <X className={`w-5 h-5 ${textColor}`} />
          </button>
        </div>

        {!showCardForm && !showStackForm && (
          <div className="space-y-3">
            <button
              id="add-wishlist-item"
              onClick={() => setShowCardForm(true)}
              className={`w-full p-5 ${inputBg} backdrop-blur-sm hover:${isDark ? 'bg-gray-700/80' : 'bg-white/20'} rounded-2xl text-left border ${borderColor} transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${textColor} text-lg`}>Create Card</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/70'}`}>
                    Add a new item to your collection
                  </p>
                </div>
              </div>
            </button>

            <button
              id="add-wishlist"
              onClick={() => setShowStackForm(true)}
              className={`w-full p-5 ${inputBg} backdrop-blur-sm hover:${isDark ? 'bg-gray-700/80' : 'bg-white/20'} rounded-2xl text-left border ${borderColor} transition-all`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${textColor} text-lg`}>Create Stack</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-white/70'}`}>
                    Organize cards into a new collection
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {showCardForm && (
          <form onSubmit={card ? handleEditCard : handleCreateCard} className="space-y-4">
            <div
              className={`relative h-48 ${inputBg} backdrop-blur-sm rounded-xl overflow-hidden border ${borderColor} shadow-[inset_0_1px_0px_rgba(255,255,255,0.1)]`}
              role="img" aria-label="Cover image preview">
              {
                isValidUrl(cardUrl) ? (
                    <img alt="Cover preview" className="w-full h-full object-cover" src={cardUrl} />
                  ) :
                  cardName ? (<img alt="Cover preview" className="w-full h-full object-cover"
                                   src={`https://ui-avatars.com/api/?name=${cardName}&size=400&background=random`} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <Image className="w-16 h-16" />
                    </div>
                  )
              }
            </div>
            <input
              id="cardImageUrl"
              type="url"
              value={cardUrl}
              onChange={(e) => setCardUrl(e.target.value)}
              placeholder="Image URL"
              className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border ${borderColor} rounded-xl ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'}`}
            />
            <input
              id="cardName"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Card name"
              required
              className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border ${borderColor} rounded-xl ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'}`}
            />
            <select
              id="cardStack"
              value={cardStackId}
              onChange={(e) => setCardStackId(e.target.value)}
              required
              className={`w-full px-3 py-3 ${inputBg} backdrop-blur-sm border ${borderColor} rounded-xl ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'}`}
            >
              <option value="" disabled>
                Select Stack
              </option>
              {stacks.map((stack) => {
                return (
                  <option key={stack.id} value={stack.id} className="bg-slate-800">
                    {stack.name}
                  </option>
                )
              })}
            </select>
            <textarea
              id="cardDescription"
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={3}
              className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border ${borderColor} rounded-xl ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'} resize-none`}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1 ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white hover:bg-gray-100'} ${isDark ? 'text-white' : 'text-purple-600'} py-3 rounded-xl font-semibold transition-colors`}
              >
                {card ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (card) {
                    setStackName('')
                    setShowStackForm(false)
                    setCardName('')
                    setCardUrl('')
                    setCardDescription('')
                    setCardStackId('')
                    setShowCardForm(false)
                    onClose()
                  } else {
                    setShowCardForm(false)
                  }
                }}
                className={`flex-1 ${inputBg} ${textColor} py-3 rounded-xl font-semibold`}
              >
                Back
              </button>
            </div>
          </form>
        )}

        {showStackForm && (
          <form onSubmit={stack ? handleEditStack : handleCreateStack} className="space-y-4">
            <div className="space-y-2">
              <div
                className="h-32 rounded-xl flex items-center justify-center text-white text-4xl font-bold border border-white/20"
                role="img"
                style={{ background: stackCover }}
              >
                <span aria-hidden="true">{stackName ? stackName.charAt(0).toUpperCase() : '?'}</span>
              </div>
              <button
                type="button"
                onClick={() => setStackCover(generateCover())}
                className={`w-full ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white hover:bg-gray-100'} ${isDark ? 'text-white' : 'text-purple-600'} py-3 rounded-xl font-semibold transition-colors`}
              >
                <span aria-hidden="true">🎨</span>
                Generate Random Color
              </button>
            </div>
            <input
              id="stackName"
              type="text"
              value={stackName}
              onChange={(e) => setStackName(e.target.value)}
              placeholder="Stack name"
              required
              className={`w-full px-4 py-3 ${inputBg} backdrop-blur-sm border ${borderColor} rounded-xl ${textColor} placeholder-${isDark ? 'gray-500' : 'white/50'}`}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className={`flex-1 ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white hover:bg-gray-100'} ${isDark ? 'text-white' : 'text-purple-600'} py-3 rounded-xl font-semibold transition-colors`}
              >
                {stack ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (stack) {
                    setStackName('')
                    setShowStackForm(false)
                    setCardName('')
                    setCardUrl('')
                    setCardDescription('')
                    setCardStackId('')
                    setShowCardForm(false)
                    onClose()
                  } else {
                    setShowStackForm(false)
                  }
                }}
                className={`flex-1 ${inputBg} ${textColor} py-3 rounded-xl font-semibold`}
              >
                Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
