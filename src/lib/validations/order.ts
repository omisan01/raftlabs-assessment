import { z } from "zod";

export const orderItemSchema = z.object({
    menuItemId: z.uuid("Invalid menu item ID format"),
    quantity: z.number().int().positive("Quantity must be greater than 0"),
    price: z.number().int().positive("Price must be greater than 0"),
});

export const checkoutSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    address: z.string().min(1, "Delivery address is required"),
    phone: z.string().min(10, "Valid phone number is required").regex(/^\d+$/, "Phone number must contain only digits"),
    totalAmount: z.number().int().positive("Total must be greater than 0"),
    items: z.array(orderItemSchema).min(1, "Cart cannot be empty"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;