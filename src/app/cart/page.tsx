'use client';

// REACT //
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// COMPONENTS //
import { InputField } from '../components/ui/InputField';

// OTHERS //
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/store/useCartStore';
import { checkoutSchema, type CheckoutInput } from '@/lib/validations/order';

export default function CheckoutPage() {
    // Define Navigation
    const router = useRouter();

    // Define Cart State and Form State
    const { cart, getTotalAmount } = useCartStore();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const totalAmount = getTotalAmount();

    // Initialize React Hook Form with Zod Validation and Default Values from Cart State
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutInput>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            customerName: '',
            address: '',
            phone: '',
            totalAmount: totalAmount,
            items: cart.map((item) => ({
                menuItemId: item.id,
                quantity: item.quantity,
                price: item.priceInRupees,
            })),
        },
    });

    /** Form Submission Handler - Validates Input, Sends Data to API, and Handles Response */
    const onSubmit = async (data: CheckoutInput) => {
        if (cart.length === 0) return;

        setIsSubmitting(true);
        setServerError(null);

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error('Something went wrong processing your order.');
            }

            // Clear basket state and route directly to tracking screen
            router.push(`/orders/${result.orderId}`);
        } catch (err: any) {
            console.error('Checkout error:', err);
            setServerError("Something went wrong while placing your order. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-md mx-auto text-center py-16 px-4">
                <span className="text-5xl">🛒</span>
                <h2 className="text-xl font-bold text-gray-900 mt-4">Your basket is empty</h2>
                <p className="text-gray-500 mt-2">Head back to our menu to add some delicious options!</p>
                <button onClick={() => router.push('/')} className="mt-6 inline-flex bg-orange-600 text-white px-6 py-2.5 rounded-xl font-semibold">
                    View Menu
                </button>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">Secure Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
                {/* Left Section: Delivery Form Details */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Delivery Information</h2>

                    {serverError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl font-medium animate-shake">
                            {serverError}
                        </div>
                    )}

                    <InputField
                        label="Full Name"
                        placeholder="John Doe"
                        error={errors.customerName}
                        {...register('customerName')}
                    />

                    <InputField
                        label="Delivery Address"
                        placeholder="123 Main St, Apartment 4B"
                        error={errors.address}
                        {...register('address')}
                    />

                    <InputField
                        label="Phone Number"
                        type="tel"
                        placeholder="9876543210"
                        error={errors.phone}
                        {...register('phone')}
                    />

                    {/* Submit CTA Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full cursor-pointer mt-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 px-4 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-md shadow-orange-500/10 text-sm tracking-wide"
                    >
                        {isSubmitting ? 'Processing Your Order...' : `Place Order •  ₹${totalAmount}`}
                    </button>
                </form>

                {/* Right Section */}
                <div className="bg-gray-50/60 border border-gray-100 p-6 rounded-2xl space-y-4 w-[300px] mx-auto">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h2 className="text-lg font-bold text-gray-900 ">Review Summary</h2>

                        {/* Edit BUtton */}
                        <button
                            onClick={() => router.push('/')}
                            className="text-xs text-gray-500 hover:text-gray-700 transition-colors mt-1 underline cursor-pointer"
                        >
                            Edit Basket
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200/60 max-h-60 overflow-y-auto pr-1">
                        {cart.map((item) => (
                            <div key={item.id} className="py-3 flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-semibold text-gray-900">
                                    ₹{item.priceInRupees * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t pt-4 flex justify-between items-center font-black text-gray-900 text-base">
                        <span>Total Value:</span>
                        <span className="text-orange-600">₹{totalAmount}</span>
                    </div>
                </div>
            </div>
        </main>
    );
}