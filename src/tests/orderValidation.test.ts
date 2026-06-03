import { checkoutSchema } from "@/lib/validations/order";

describe("Checkout Validation", () => {
    it("accepts valid payload", () => {
        expect(() =>
            checkoutSchema.parse({
                customerName: "Omkar",
                address: "Mumbai",
                phone: 9999999999,
                totalAmount: 500,
                items: [
                    {
                        menuItemId: "6b29141b-dc7c-486d-b8cb-465451fa79e9",
                        quantity: 1,
                        price: 500,
                    },
                ],
            })
        ).not.toThrow();
    });

    it("rejects empty customer name", () => {
        expect(() =>
            checkoutSchema.parse({
                customerName: "",
                address: "Mumbai",
                phone: 9999999999,
                totalAmount: 500,
                items: [
                    {
                        menuItemId: "6b29141b-dc7c-486d-b8cb-465451fa79e9",
                        quantity: 1,
                        price: 500,
                    },
                ],
            })
        ).toThrow();
    });

    it("rejects empty items array", () => {
        expect(() =>
            checkoutSchema.parse({
                customerName: "Omkar",
                address: "Mumbai",
                phone: 9999999999,
                totalAmount: 500,
                items: [],
            })
        ).toThrow();
    });
});