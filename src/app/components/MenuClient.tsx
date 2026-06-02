'use client';

// REACT //
import { useRouter } from 'next/navigation';

// TYPES //
import { MenuItem } from '@/types/menu';

// OTHERS //
import { useCartStore } from '@/store/useCartStore';
import { MenuItemCard } from './MenuItemCard';

/** Menu Client Component - Displays the list of menu items and the cart icon with count */
export default function MenuClient({ initialItems }: { initialItems: MenuItem[] }) {
    const cart = useCartStore((state) => state.cart);
    const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const router = useRouter();
    const { clearCart } = useCartStore();

    return (
        <div className="space-y-8">
            {/* Sticky Actions Header Bar */}
            <div className="sticky top-4 z-40 flex justify-end items-center gap-3">

                {/* Clear Cart Action Button - Conditionally Rendered with Subtle Animation */}
                {totalCartCount > 0 && (
                    <button
                        onClick={() => clearCart()}
                        className="cursor-pointer bg-red-50/90 backdrop-blur-md border border-red-100 hover:bg-red-100 text-red-600 px-4 py-3 rounded-2xl font-medium text-sm shadow-md shadow-red-900/5 transition-all duration-200 active:scale-95 animate-in fade-in slide-in-from-right-4 duration-300"
                    >
                        🗑️ Clear Cart
                    </button>
                )}

                {/* Sticky Cart Icon with Count */}
                <button
                    onClick={() => router.push('/cart')}
                    className="cursor-pointer bg-white/80 backdrop-blur-md border border-orange-100 px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-orange-950/5 flex items-center gap-3 transition-all duration-300 hover:border-orange-200 active:scale-95"
                >
                    <div className="relative">
                        <span className="text-xl">🛒</span>
                        {totalCartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce">
                                {totalCartCount}
                            </span>
                        )}
                    </div>
                    <span className="text-sm text-gray-700">Cart</span>
                </button>
            </div>
            {/* Menu Item Card Layout Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {initialItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
}