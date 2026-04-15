import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'STUDENT' | 'INSTITUTION_ADMIN' | 'INSTITUTION_STAFF' | 'SUPER_ADMIN';
    institutionId?: string;
    institutionName?: string;
    institutionSlug?: string;
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

    const isAdmin = user?.role === 'INSTITUTION_ADMIN' || user?.role === 'SUPER_ADMIN';
    const isStaff = user?.role === 'INSTITUTION_STAFF';
    const canManageSettings = user?.role === 'INSTITUTION_ADMIN' || user?.role === 'SUPER_ADMIN';

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
            isSuperAdmin: user?.role === 'SUPER_ADMIN'
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
