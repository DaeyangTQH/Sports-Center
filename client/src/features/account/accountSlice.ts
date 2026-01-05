import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../app/models/user";

interface AccountState {
    user: User | null;
}

function loadUserFromStorage(): User | null {
    try {
        const raw = localStorage.getItem("user");
        return raw ? (JSON.parse(raw) as User) : null;
    } catch {
        return null;
    }
}

const initialState: AccountState = {
    user: loadUserFromStorage(),
};

export const accountSlice = createSlice({
    name: "account",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
            localStorage.setItem("token", action.payload.token);
        },
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { setUser, signOut } = accountSlice.actions;
export default accountSlice.reducer;


