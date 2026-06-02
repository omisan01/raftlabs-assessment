import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { checkoutSchema } from "@/lib/validations/order";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // 1. Validate payload using the shared schema definition rules
        const validatedData = checkoutSchema.parse(body);

        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        // 2. Insert main transaction ledger item block inside 'orders' table
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                customer_name: validatedData.customerName,
                delivery_address: validatedData.address,
                phone_number: validatedData.phone,
                total_price_rupees: validatedData.totalAmount,
                status: "ORDER_RECEIVED", // default database enum initiation state
            })
            .select("id")
            .single();

        if (orderError) {
            return NextResponse.json({ error: orderError.message }, { status: 400 });
        }

        // 3. Map line-items array data block to inject the foreign transaction keys
        const orderItemsPayload = validatedData.items.map((item) => ({
            order_id: order.id,
            menu_item_id: item.menuItemId,
            quantity: item.quantity,
            price_at_purchase_rupees: item.price, // Lock snapshot value
        }));

        // 4. Batch bulk execution insert inside 'order_items'
        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsPayload);

        if (itemsError) {
            return NextResponse.json({ error: itemsError.message }, { status: 400 });
        }

        // Return the generated key back to client loop to allow redirection mechanics
        return NextResponse.json({ orderId: order.id }, { status: 201 });
    } catch (error: any) {
        // Handle parsing validation syntax mapping failures explicitly
        if (error.errors) {
            return NextResponse.json({ error: "Validation constraints rejected payload", details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal Server Processing Failure" }, { status: 500 });
    }
}