import React, { useState, useEffect, useContext } from 'react';
import backgroundImage1 from '../../assets/images/background1.jpg';
import backgroundImage2 from '../../assets/images/background2.jpg';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.jpg';
import backgroundImage6 from '../../assets/images/background6.jpg';
import backgroundImage7 from '../../assets/images/background7.jpg';
import backgroundImage8 from '../../assets/images/background8.jpg';
import studyHubLogo from '../../assets/images/studyHubLogo.png';
import '../../assets/styles/homePage.css';
import AuthContext from "./AuthContext.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function HomePage() {
    const [formData, setFormData] = useState({
        email: "",
        verification_code: "",
        name: "",
    });

    const { checkEmail, login, register, resendVerificationCode } = useContext(AuthContext);
    const [signInStatus, setSignInStatus] = useState("checkingEmail");
    const [serverMessage, setServerMessage] = useState("");

    async function loginUser(event) {
        event.preventDefault();
        if (signInStatus === "registerRequired") {
            const response = await register(formData);
            setServerMessage(response);
        } else if (signInStatus === "alreadyRegistered") {
            const response = await login({
                email: formData.email,
                verification_code: formData.verification_code,
            });
            setServerMessage(response);
        } else {
            const response = await checkEmail({ email: formData.email });
            if (response.status === 200) {
                setSignInStatus("alreadyRegistered");
            } else if (response.status === 202) {
                setSignInStatus("registerRequired");
            }
            setServerMessage(response.data.message);
        }
    }

    const [isEmailValid, setIsEmailValid] = useState(true);
   
    function handleFormChange(event) {
        const { name, value } = event.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value,
        }));
        
        if (name === 'email') {
            setIsEmailValid(!value || /\S+@\S+\.\S+/.test(value));
        }
    }

    function goBackToEmailInput() {
        setSignInStatus("checkingEmail");
        setFormData({ ...formData, email: "", verification_code: "", name: "" });
        setServerMessage("");
    }
    
    // Background image handling
    const backgroundImages = [
        backgroundImage1,
        backgroundImage2,
        backgroundImage3,
        backgroundImage4,
        backgroundImage5,
        backgroundImage6,
        backgroundImage7, 
        backgroundImage8, 
    ];

    const [currentBackgroundImage, setCurrentBackgroundImage] = useState('');

    useEffect(() => {
        const selectRandomBackgroundImage = () => {
            const randomIndex = Math.floor(Math.random() * backgroundImages.length);
            return backgroundImages[randomIndex];
        };
        setCurrentBackgroundImage(selectRandomBackgroundImage());
    }, []);

    const containerStyle = {
        backgroundImage: `url(${currentBackgroundImage})`,
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        transition: 'background-size 1s ease',
    };

    return (
        <div className="container" style={containerStyle}>
            <div className="dark-overlay"></div>
            <div className="nav-bar">
                <img src={studyHubLogo} alt="StudyHub Logo" />
            </div>
            <div className="home-content">
                {signInStatus === "checkingEmail" ? (
                    <div className="authentication">
                        <h1>Welcome to StudyHub</h1>
                        <div className="slogan">Experience the Symphony of Productivity and Focus</div>
                        <h2>Let's start with your email</h2>
                        <form className="input-container" onSubmit={loginUser}>
                            <input
                                type="text"
                                name="email"
                                onChange={handleFormChange}
                                placeholder="Your Email"
                                className={!isEmailValid ? "input-error" : ""}
                            />
                            {formData.email && !isEmailValid && (
                                <p className="error-message">
                                    <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                                    Please enter a valid email address
                                </p>
                            )}
                            <button type="submit" disabled={!formData.email.trim()}>Continue</button>
                        </form>
                        <p>{serverMessage}</p>
                    </div>
                ) : (
                    <>
                    <button className="back-button" onClick={goBackToEmailInput}>
                        &#x276E;
                    </button>
                    <form className="input-container-2" onSubmit={loginUser}>
                        {signInStatus === "registerRequired" ? (
                            <div className="register">
                                <h1>Welcome Aboard!</h1>
                                <div className="form-instructions">
                                    Please enter your name and check your email for verification code.
                                </div>
                                <input
                                    className="verified-input"
                                    name="name"
                                    onChange={handleFormChange}
                                    type="text"
                                    placeholder="Your Name"
                                />
                                <input
                                    className="verified-input"
                                    name="verification_code"
                                    onChange={handleFormChange}
                                    type="text"
                                    placeholder="Verification Code"
                                />
                                <button type="submit" disabled={!formData.name.trim() || !formData.verification_code.trim()}>Sign In</button>
                            </div>
                        ) : (
                            <>
                                <h1>Welcome back!</h1>
                                <div className="form-instructions">
                                    Enter the verification code sent to your email.
                                </div>
                                <input
                                    className="verified-input"
                                    name="verification_code"
                                    onChange={handleFormChange}
                                    type="text"
                                    placeholder="Verification Code"
                                />
                                <button type="submit" disabled={!formData.verification_code.trim()}>Sign In</button>
                                <button 
                                    onClick={()=>resendVerificationCode({"email":formData.email})}
                                >
                                    Resend
                                </button>
                            </>
                        )}
                    </form>
                    </>
                )}
            </div>
        </div>
    );
}
export default HomePage;
