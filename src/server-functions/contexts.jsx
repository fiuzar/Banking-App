import { createContext, useEffect } from "react";

export const UserContext = createContext({
    user: {},
    setUser: () => {}
});

export const AccountDetailsContext = createContext({
    accountDetails: {
        savings_balance: 0.00,
        checking_balance: 0.00
    },
    setAccountDetails: () => {}
});