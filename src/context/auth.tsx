import React, { useContext, useEffect, useState } from "react";

//lib
import apiClient from "@/lib/apiClient";

//type
interface AuthContextType {
    user: ResUserType | null
    login: (token: string) => void,
    logout: () => void
}

interface AuthProviderProps {
    children: React.ReactNode;
}

interface ResUserType {
    id: number,
    email: string,
    username: string
}

const AuthContext = React.createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<ResUserType | null>(null);
    
    useEffect(() => {
        const token: string = localStorage.getItem("auth_token") || "";
        if (token) {
            apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
            apiClient.get("/users/find").then((res) => {
                setUser(res.data.user);
            }).catch((err) => {
                console.error(err);
            });
        };

    }, []);

    const login = async (token: string) => {
        localStorage.setItem("auth_token", token);
        apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;

        try {
            apiClient.defaults.headers["Authorization"] = `Bearer ${token}`;
            apiClient.get("/users/find").then(res => setUser(res.data.user));
        } catch (err) {
            console.error(err);
        };
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        delete apiClient.defaults.headers["Authorization"];
        setUser(null);
    };

    const value = {
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
};