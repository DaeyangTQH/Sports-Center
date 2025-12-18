import type {Basket} from "../../app/models/Basket.ts";
import {createSlice} from "@reduxjs/toolkit";

interface BasketState {
    basket: Basket | null
}

const initialState: BasketState = {
    basket: null
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setBasket: (state, action) => {
            // console.log('new basket set:', action.payload);
            state.basket = action.payload;
        }
    }
})

export const {setBasket} = basketSlice.actions;