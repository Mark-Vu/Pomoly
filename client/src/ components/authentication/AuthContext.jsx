import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './Api.jsx';
const AuthContext = createContext();


export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        let userProfile = localStorage.getItem("userProfile");
        if (userProfile) {
            return JSON.parse(userProfile);
        }
        return null;
    });
    console.log(user)
    const navigate = useNavigate();

    const checkEmail = async (payload) => {
        const response = await api.post("/users/auth/email", payload, {
            withCredentials: true,
        });
        return response;
    };

    const resendVerificationCode = async (payload) => {
        await api.post('/users/auth/verification-code/resend', payload, {
            withCredentials: true,
        });
    }

    const getUserProfile = async () => {
        try {
            let apiResponse = await api.get("/api/user-profile", {
            withCredentials: true,
            });
            localStorage.setItem("userProfile", JSON.stringify(apiResponse.data));
            setUser(apiResponse.data);
        } catch (error) {
            console.log(error)
        }
        
    }

    const register = async (payload) => {
        try {
            const response = await api.post("/users/auth/register", payload, {
                withCredentials: true,
            });
            const data = response.data
            save_csrf_tokens(data.access_csrf, data.refresh_csrf)
            await getUserProfile();
            window.location.reload();
            return response.data.message; // Return the response data
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
            const response = await api.post("/users/auth/login", payload, {
                withCredentials: true,
            });
            const data = response.data
            save_csrf_tokens(data.access_csrf, data.refresh_csrf)
            await getUserProfile();
            window.location.reload();
            return response.data.message;
        }
        catch (error) {
            return error
        }
    };

    const logout = async () => {
        try {
            const response = await api.post("/users/auth/logout",{
                withCredentials: true,
            });
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
        <AuthContext.Provider value={{ user, login, checkEmail, register, logout, getUserProfile, resendVerificationCode }}>
            {children}
        </AuthContext.Provider>
        </>
        );
};

export default AuthContext;