'use client';

// REACT //
import { useEffect, useState, use } from 'react';

// UTILS //
import { createClient } from '@/utils/supabase/client';
import { useCartStore } from '@/store/useCartStore';

// Initialize a standard public client for client-side listening
const supabase = createClient();

type OrderStatus = 'ORDER_RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

interface OrderDetails {
    id: string;
    customer_name: string;
    delivery_address: string;
    status: OrderStatus;
    total_price_rupees: number;
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const { clearCart } = useCartStore();

    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);

    useEffect(() => {
        clearCart();
    }, []);

    // 1. Fetch initial order details on load
    useEffect(() => {
        async function fetchOrder() {
            const { data, error } = await supabase
                .from('orders')
                .select('id, customer_name, delivery_address, status, total_price_rupees')
                .eq('id', orderId)
                .single();

            if (!error && data) {
                setOrder(data as OrderDetails);
            }
            setLoading(false);
        }
        fetchOrder();
    }, [orderId]);

    // 2. Listen to real-time changes on this specific order row
    useEffect(() => {
        const channel = supabase
            .channel(`order-tracking-${orderId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `id=eq.${orderId}`,
                },
                (payload) => {
                    // Instantly update the UI state when database row updates
                    setOrder((prev) => prev ? { ...prev, status: payload.new.status } : null);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [orderId]);

    // 3. Helper to trigger the status simulation endpoint
    const advanceSimulation = async () => {
        if (!order) return;
        setIsSimulating(true);

        try {
            await fetch(`/api/orders/${orderId}/status`, { method: 'PATCH' });
        } catch (err) {
            console.error("Simulation trigger failed", err);
        } finally {
            setIsSimulating(false);
        }
    };

    if (loading) {
        return <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium">Locating your order tracker...</div>;
    }

    if (!order) {
        return <div className="max-w-xl mx-auto py-20 text-center text-red-500 font-bold">Order not found.</div>;
    }

    // Simple progress steps array mapping to our statuses
    const statuses: OrderStatus[] = ['ORDER_RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentStepIndex = statuses.indexOf(order.status);

    return (
        <main className="max-w-xl mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-8">

                {/* Header Block */}
                <div className="text-center space-y-2">
                    <span className="text-4xl">🍕</span>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Track Your Order</h1>
                    <p className="text-xs text-gray-400 font-mono">ID: {order.id}</p>
                </div>

                {/* Clean Progress Visual Tracker */}
                <div className="relative pt-4">
                    <div className="absolute top-[38px] left-4 right-4 h-1 bg-gray-100 -z-10" />
                    <div
                        className="absolute top-[38px] left-4 h-1 bg-orange-500 -z-10 transition-all duration-500 paths-ease"
                        style={{ width: `${(currentStepIndex / (statuses.length - 1)) * 90}%` }}
                    />

                    <div className="flex justify-between items-center text-center">
                        {statuses.map((step, index) => {
                            const isCompleted = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;
                            return (
                                <div key={step} className="flex flex-col items-center flex-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all duration-300 ${isCompleted ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20' : 'bg-white border-gray-200 text-gray-400'
                                        } ${isCurrent ? 'scale-125 ring-4 ring-orange-100' : ''}`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-[10px] font-bold mt-2 uppercase tracking-tight max-w-[70px] ${isCurrent ? 'text-orange-600' : 'text-gray-400'}`}>
                                        {step.replace(/_/g, ' ')}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info Card Summary */}
                <div className="bg-gray-50/60 rounded-2xl p-5 text-sm space-y-3 border border-gray-100/60">
                    <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-bold text-gray-800">{order.customer_name}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="font-bold text-gray-800 text-right max-w-[200px] line-clamp-1">{order.delivery_address}</span></div>
                    <div className="flex justify-between border-t pt-3 font-bold"><span className="text-gray-900">Total Paid</span><span className="text-orange-600">₹{(order.total_price_rupees)}</span></div>
                </div>

                {/* Developer Simulation Trigger Panel */}
                <div className="pt-4 border-t border-gray-100 text-center">
                    <button
                        onClick={advanceSimulation}
                        disabled={isSimulating || order.status === 'DELIVERED'}
                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-orange-600 disabled:opacity-40 transition-all active:scale-95 shadow-lg"
                    >
                        {isSimulating ? 'Updating...' : order.status === 'DELIVERED' ? '🎉 Order Complete' : '⚡ Simulate Kitchen Step'}
                    </button>
                    <p className="text-[10px] text-gray-400 mt-2">Clicking this advances the order row via the API, testing the real-time websocket channel live.</p>
                </div>

                {/* Back to Home CTA */}
                <div className="text-center pt-4">
                    <a href="/" className="inline-block bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-bold hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] transition-all shadow-md shadow-orange-500/10">
                        Back to Menu
                    </a>
                </div>

            </div>
        </main>
    );
}