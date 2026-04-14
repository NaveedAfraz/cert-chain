import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF' | 'USER';
    isSuperAdmin: boolean;
    institutionId?: string;
    institutionName?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (token: string, user: User) => void;
    updateUser: (partialUser: Partial<User>) => void;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isStaff: boolean;
    canManageSettings: boolean;
    isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const updateUser = (partialUser: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...partialUser };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'ADMIN' || user?.isSuperAdmin === true;
    const isStaff = user?.role === 'STAFF';
    const canManageSettings = user?.role === 'ADMIN' || user?.isSuperAdmin === true;

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            updateUser,
            logout,
            isAuthenticated: !!token,
            isAdmin: isAdmin || isStaff, // 'isAdmin' in UI often just means 'has dashboard access'
            isStaff,
            canManageSettings,
            isSuperAdmin: user?.isSuperAdmin === true
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
