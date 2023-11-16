import { createContext, useState } from "react";
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
            await getUserProfile();
            window.location.reload();
            return response.data.message; // Return the response data
        } catch (error) {
            return error;
        }
    };

    const login = async (payload) => {
        try {
            const response = await api.post("/users/auth/login", payload, {
                withCredentials: true,
            });
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
            window.location.reload();
        }
        catch (error) {
            return error
        }
    } 
    return (
        <>
        <AuthContext.Provider value={{ user, login, checkEmail, register, logout, getUserProfile}}>
            {children}
        </AuthContext.Provider>
        </>
        );
};

export default AuthContext;