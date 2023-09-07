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
    console.log(user)
    const navigate = useNavigate();

    const checkEmail = async (payload) => {
        const response = await axios.post("http://127.0.0.1:5000/users/auth/email", payload, {
            withCredentials: true,
        });
        return response;
    };

    const getUserProfile = async () => {
        let apiResponse = await axios.get("http://127.0.0.1:5000/dashboard", {
            withCredentials: true,
        });
        localStorage.setItem("userProfile", JSON.stringify(apiResponse.data.message));
        setUser(apiResponse.data);
        navigate("/dashboard");
    }

    const register = async (payload) => {
        await axios.post("http://127.0.0.1:5000/users/auth/register", payload, {
            withCredentials: true,
        });
        await getUserProfile();
    }

    const login = async (payload) => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/users/auth/login", payload, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
                credentials: 'include',
            });
            console.log(response.data.message)
            await getUserProfile();
            return response;
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