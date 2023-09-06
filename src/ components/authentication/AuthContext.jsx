import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        let userProfle = localStorage.getItem("userProfile");
        if (userProfle) {
            return JSON.parse(userProfle);
        }
        return null;
    });
    const navigate = useNavigate();
    const customHeaders = {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Credentials": "*",
    }
    const checkEmail = async (payload) => {
        return await axios.post("http://localhost:5000/users/auth/email", payload, {
            headers: customHeaders,
        });
    };

    const getUserProfile = async () => {
        let apiResponse = await axios.get("http://localhost:5000/dashboard", {
            headers: customHeaders,
            withCredentials: true,
        });
        localStorage.setItem("userProfile", JSON.stringify(apiResponse.message));
        setUser(apiResponse.data);
        navigate("/");
    }

    const register = async (payload) => {
        await axios.post("http://localhost:5000/users/auth/register", payload, {
            headers: customHeaders,
            withCredentials: true,
        });
        await getUserProfile();
    }

    const login = async (payload) => {
        await axios.post("http://localhost:5000/users/auth/login", payload, {
            headers: customHeaders,
            withCredentials: true,
        });
        await getUserProfile();
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