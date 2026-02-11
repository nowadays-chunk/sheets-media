import * as actionTypes from '../actionTypes';

const initialState = {
    items: [],
    total: 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_TO_CART:
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                    total: state.total + action.payload.price,
                };
            }
            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1 }],
                total: state.total + action.payload.price,
            };

        case actionTypes.REMOVE_FROM_CART:
            const itemToRemove = state.items.find(item => item.id === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
            };

        case actionTypes.UPDATE_QUANTITY:
            const itemToUpdate = state.items.find(item => item.id === action.payload.id);
            if (!itemToUpdate) return state;

            const quantityDifference = action.payload.quantity - itemToUpdate.quantity;

            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
                        : item
                ),
                total: state.total + (itemToUpdate.price * quantityDifference),
            };

        case actionTypes.CLEAR_CART:
            return initialState;

        default:
            return state;
    }
};

export default cartReducer;
