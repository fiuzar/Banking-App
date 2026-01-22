import { createContext } from "react";

export const UserContext = createContext({
    user: {},
    setUser: () => {}
});

export const AccountDetailsContext = createContext({
    accountDetails: {},
    setAccountDetails: () => {}
});