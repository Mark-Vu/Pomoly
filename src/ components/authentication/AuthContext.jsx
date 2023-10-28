import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from './api';
const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        let userProfle = localStorage.getItem("userProfile");
        if (userProfle) {
            return JSON.parse(userProfle);
        }
        return null;
    });
    console.log(user)
    const navigate = useNavigate();

    const checkEmail = async (payload) => {
        const response = await axios.post("http://127.0.0.1:5000/users/auth/email", payload, {
            withCredentials: true,
        });
        return response;
    };

    const getUserProfile = async () => {
        let apiResponse = await api.get("http://127.0.0.1:5000/api/user-profile", {
            withCredentials: true,
        });
        localStorage.setItem("userProfile", JSON.stringify(apiResponse.data.message));
        setUser(apiResponse.data);
    }

    const register = async (payload) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/users/auth/register", payload, {
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
            const response = await axios.post("http://127.0.0.1:5000/users/auth/login", payload, {
                withCredentials: true,
            });
            console.log(response.data.message)
            await getUserProfile();
            window.location.reload();
            return response.data.message;
        }
        catch (error) {
            return error
        }
    };
    return (
        <>
        <AuthContext.Provider value={{ user, login, checkEmail, register }}>
            {children}
        </AuthContext.Provider>
        </>
        );
};

export default AuthContext;