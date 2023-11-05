import React, { useState, useEffect, useContext } from 'react';
import backgroundImage1 from '../../assets/images/background1.jpg';
import backgroundImage2 from '../../assets/images/background2.jpg';
import backgroundImage3 from '../../assets/images/background3.jpg';
import backgroundImage4 from '../../assets/images/background4.jpg';
import backgroundImage5 from '../../assets/images/background5.jpg';
import backgroundImage6 from '../../assets/images/background6.jpg';
import backgroundImage7 from '../../assets/images/background7.jpg';
import studyHubLogo from '../../assets/images/studyHubLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from "@fortawesome/free-solid-svg-icons";
import '../../assets/styles/homePage.css';
import AuthContext from "./AuthContext.jsx";

function HomePage() {
    const [formData, setFormData] = useState({
        email: "",
        verification_code: "",
        name: "",
    });

    const { checkEmail, login, register } = useContext(AuthContext);
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

    function handleFormChange(event) {
        setFormData(prevFormData => ({
            ...prevFormData,
            [event.target.name]: event.target.value,
        }));
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
                            />
                            <button type="submit">Continue</button>
                        </form>
                        <p>{serverMessage}</p>
                    </div>
                ) : (
                    <form className="input-container-2" onSubmit={loginUser}>
                        {signInStatus === "registerRequired" ? (
                            <>
                                <h1>Set Up Your Account</h1>
                                <div className="form-instructions">
                                    Welcome aboard! Let's get your account ready.
                                </div>
                                <input
                                    className="verified-input"
                                    name="name"
                                    onChange={handleFormChange}
                                    type="text"
                                    placeholder="Full Name"
                                />
                                <div className="form-instructions">
                                    Now, please enter the verification code we sent to your email.
                                </div>
                                <input
                                    className="verified-input"
                                    name="verification_code"
                                    onChange={handleFormChange}
                                    type="text"
                                    placeholder="Verification Code"
                                />
                                <button type="submit">Complete Registration</button>
                            </>
                        ) : (
                            <>
                                <h2>Sign In</h2>
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
                                <button type="submit">Sign In</button>
                            </>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
export default HomePage;
