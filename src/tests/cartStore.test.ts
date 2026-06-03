import { useCartStore } from "@/store/useCartStore";

describe("Cart Store", () => {
    beforeEach(() => {
        useCartStore.getState().clearCart();
    });

    it("adds item to cart", () => {
        useCartStore.getState().addToCart({
            id: "1",
            name: "Pizza",
            priceInRupees: 299,
        });

        expect(
            useCartStore.getState().cart.length
        ).toBe(1);
    });

    it("increments quantity for existing item", () => {

        useCartStore.getState().addToCart({
            id: "1",
            name: "Pizza",
            priceInRupees: 299,
        });

        useCartStore.getState().addToCart({
            id: "1",
            name: "Pizza",
            priceInRupees: 299,
        });

        expect(
            useCartStore.getState().cart[0].quantity
        ).toBe(2);
    });

    it("calculates total amount", () => {
        useCartStore.getState().addToCart({
            id: "1",
            name: "Pizza",
            priceInRupees: 299,
        });

        expect(
            useCartStore.getState().getTotalAmount()
        ).toBe(299);
    });

    it("removes item from cart", () => {
        const store = useCartStore.getState();

        store.addToCart({
            id: "1",
            name: "Pizza",
            priceInRupees: 299,
        });

        store.removeFromCart("1");

        expect(
            useCartStore.getState().cart.length
        ).toBe(0);
    });
});