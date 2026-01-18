import React from 'react';
import WishlistDock from './components/WishlistDock';

export default function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl font-black text-white mb-4 drop-shadow-lg">
                        Wishlist Widget
                    </h1>
                    <p className="text-2xl text-white/90 mb-8 drop-shadow">
                        Your personal collection manager
                    </p>
                    <p className="text-lg text-white/80">
                        Click the dock at the bottom to get started! ✨
                    </p>
                </div>
            </div>

            <WishlistDock />
        </div>
    );
}
