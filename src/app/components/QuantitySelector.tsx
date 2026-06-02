'use client';

// OTHERS //
import { useCartStore } from '@/store/useCartStore';

interface QuantitySelectorProps {
    itemId: string;
    priceInRupees: number;
    name: string;
}

/** Quantity Selector Component - Displays add to cart button or quantity controls based on cart state */
export default function QuantitySelector({ itemId, priceInRupees, name }: QuantitySelectorProps) {
    // Define Store Hooks for Cart State and Actions
    const cart = useCartStore((state) => state.cart);
    const addToCart = useCartStore((state) => state.addToCart);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeFromCart = useCartStore((state) => state.removeFromCart);

    // Find the current quantity of the item in the cart
    const currentItem = cart.find((item) => item.id === itemId);

    // Determine the quantity to display based on the cart state
    const quantity = currentItem ? currentItem.quantity : 0;

    if (quantity === 0) {
        return (
            <button
                onClick={() => addToCart({ id: itemId, name, priceInRupees })}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 cursor-pointer px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all duration-200 shadow-md shadow-orange-500/10 flex justify-center items-center gap-2 tracking-wide text-sm"
            >
                Add to Cart
            </button>
        );
    }

    return (
        <div className="flex items-center justify-between w-full bg-orange-50/80 border border-orange-200/60 p-1 rounded-xl shadow-inner transition-all duration-200 animate-in fade-in zoom-in-95 duration-150">
            <button
                onClick={() => {
                    if (quantity === 1) {
                        removeFromCart(itemId);
                    } else {
                        updateQuantity(itemId, quantity - 1);
                    }
                }}
                className="w-10 cursor-pointer h-10 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-600 hover:text-white active:scale-90 transition-all duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                </svg>
            </button>

            <span className="font-bold text-orange-950 px-4 text-base tabular-nums select-none animate-delay-75">
                {quantity}
            </span>

            <button
                onClick={() => updateQuantity(itemId, quantity + 1)}
                className="w-10 cursor-pointer h-10 flex items-center justify-center bg-white text-orange-600 font-bold rounded-lg shadow-sm hover:bg-orange-600 hover:text-white active:scale-90 transition-all duration-150"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    );
}