import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
    statusTab: false,
    total: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { productId, source, quantity = 1 } = action.payload;
            const existingItem = state.items.find(
                item => item.productId === productId && item.source === source
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({
                    productId,
                    source,
                    quantity
                });
            }
        },
        changeQuantity(state, action) {
            const { productId, quantity, source } = action.payload;
            const indexProductId = (state.items).findIndex(item => item.productId === productId && item.source === source);
            if (indexProductId >= 0) {
                // Only allow quantity change for non-service items
                if (source !== 'memberships') {
                    if (quantity > 0) {
                        state.items[indexProductId].quantity = quantity;
                    } else {
                        // Remove if quantity is 0 or less for non-service items
                        state.items = (state.items).filter(item => !(item.productId === productId && item.source === source));
                    }
                    localStorage.setItem("carts", JSON.stringify(state.items));
                } else {
                    console.log('Attempted to change quantity for service item, operation ignored.');
                }
            }
        },
        toggleStatusTab: (state) => {
            state.statusTab = !state.statusTab;
        },
        removeFromCart: (state, action) => {
            const { productId, source } = action.payload;
            state.items = state.items.filter(
                item => !(item.productId === productId && item.source === source)
            );
        },
        updateQuantity: (state, action) => {
            const { productId, source, quantity } = action.payload;
            const item = state.items.find(
                item => item.productId === productId && item.source === source
            );
            if (item) {
                // Only allow quantity update for non-service items
                if (source !== 'memberships') {
                    item.quantity = quantity;
                    localStorage.setItem("carts", JSON.stringify(state.items));
                } else {
                    console.log('Attempted to update quantity for service item, operation ignored.');
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
            localStorage.removeItem("carts");
        }
    }
})

export const {
    addToCart,
    changeQuantity,
    toggleStatusTab,
    removeFromCart,
    updateQuantity,
    clearCart
} = cartSlice.actions;

export default cartSlice.reducer;