import {type TypedUseSelectorHook, useSelector, useDispatch} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {basketSlice} from "../../features/basket/basketSlice.ts";
import accountReducer from "../../features/account/accountSlice.ts";

export const store = configureStore({
    reducer: {
        basket: basketSlice.reducer,
        account: accountReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;