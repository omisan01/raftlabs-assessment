// src/app/api/orders/[id]/status/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

type OrderStatus = 'ORDER_RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';

const nextStatusMap: Record<OrderStatus, OrderStatus> = {
    'ORDER_RECEIVED': 'PREPARING',
    'PREPARING': 'OUT_FOR_DELIVERY',
    'OUT_FOR_DELIVERY': 'DELIVERED',
    'DELIVERED': 'DELIVERED'
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: orderId } = await params;
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        // 1. Fetch current status
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('status')
            .eq('id', orderId)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 2. Compute the next step using our state transition map
        const nextStatus = nextStatusMap[order.status as OrderStatus];

        // 3. Update row in database
        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: nextStatus })
            .eq('id', orderId);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, status: nextStatus });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Processing Failure' }, { status: 500 });
    }
}