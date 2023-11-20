import React, { createContext, useState } from "react";
import api from './Api.jsx';
const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("userProfile")) || null);

    const checkEmail = async (payload) => {
        const response = await api.post("/users/auth/email", payload);
        return response;
    };

    const resendVerificationCode = async (payload) => {
        await api.post('/users/auth/verification-code/resend', payload);
    }

    const fetchUserProfile = async () => {
        try {
            let response = await api.get("/users/info");
            localStorage.setItem("userProfile", JSON.stringify(response.data));
            setUser(response.data);
        } catch (error) {
            console.log(error)
        }
        
    }

    const register = async (payload) => {
        try {
            const response = await api.post("/users/auth/register", payload);
            const data = response.data
            save_csrf_tokens(data.access_csrf, data.refresh_csrf)
            await fetchUserProfile();
            window.location.reload();
            return response.data.message; 
        } catch (error) {
            return error;
        }
    };

    const save_csrf_tokens = (access_token, refresh_token) => {
        localStorage.setItem('csrf_access_token', access_token)
        localStorage.setItem('csrf_refresh_token', refresh_token)
    }
    const login = async (payload) => {
        try {
            const response = await api.post("/users/auth/login", payload);
            const data = response.data
            save_csrf_tokens(data.access_csrf, data.refresh_csrf)
            await fetchUserProfile();
            window.location.reload();
            return response.data.message;
        }
        catch (error) {
            return error
        }
    };

    const logout = async () => {
        try {
            await api.post("/users/auth/logout");
            localStorage.removeItem("userProfile")
            localStorage.removeItem("csrf_access_token")
            localStorage.removeItem("csrf_refresh_token")
            window.location.reload();
        }
        catch (error) {
            return error
        }
    } 
    return (
        <>
        <AuthContext.Provider value={{ user, login, checkEmail, register, logout, fetchUserProfile, resendVerificationCode }}>
            {children}
        </AuthContext.Provider>
        </>
        );
};

export default AuthContext;