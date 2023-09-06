import homePageImage from '../../assets/images/homePageImage.png';
import studyHubLogo from '../../assets/images/studyHubLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import '../../assets/styles/homePage.css'
import  AuthContext  from "./AuthContext.jsx";
import { useState, useContext } from "react";

function HomePage() {
    const [ formData, setFormData ] = useState({
        "email": "",
        "verification_code": "",
        "name": "",
    });
    const { checkEmail, login, register } = useContext(AuthContext);
    let signInStatus = "checkingEmail"
    let serverMessage;
    console.log(formData)
    async function loginUser(event) {
        event.preventDefault();
        if (signInStatus === "registerRequired") {
            await register(formData)
        }
        else if (signInStatus === "alreadyRegistered") {
            await login({
                "email" : formData.email,
                "verification_code": formData.verification_code
            })
        } else {
            const status = await checkEmail({"email": formData.email});
            if (status === 200) {
                signInStatus = "alreadyRegistered"
            }
            if (status === 202) {
                signInStatus = "registerRequired"
            }
            serverMessage = status.message;
        }
    }

    function handleFormChange(event) {
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [event.target.name]: event.target.value
            }
        })
    }


    return (
        <div className="container">
            <div className="nav-bar">
                <div className="container">
                    <img src={studyHubLogo} alt="logo"></img>
                </div>
            </div>
            <div className="home-content">
                <div className="content">
                    <h2>Welcome to StudyHub, your one-stop study space designed to boost your productivity and concentration.</h2>
                    <img className="main-image" src={homePageImage} alt="3D image"></img>
                </div>
                <div className="authentication">
                    <div className="sign-in">
                        <h1>Sign In</h1>
                        <form className="input-container" onSubmit={loginUser}>
                            <div className="input-cover">
                                <svg className="input-icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="35"
                                    height="36"
                                    viewBox="0 0 35 36"
                                    fill="none">
                                    <path d="M24.945 13.6704L18.8642 18.7298C17.7134 19.6622 16.1003 19.6622 14.9495 18.7298L8.81647 13.6704" stroke="#807A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.1475 5.47768H23.5879C25.5259 5.50014 27.3704 6.34677 28.6919 7.82039C30.0134 9.294 30.6966 11.266 30.5822 13.277V22.894C30.6966 24.9051 30.0134 26.8771 28.6919 28.3507C27.3704 29.8243 25.5259 30.6709 23.5879 30.6934H10.1475C5.98483 30.6934 3.17929 27.1938 3.17929 22.894V13.277C3.17929 8.97722 5.98483 5.47768 10.1475 5.47768Z" stroke="#807A7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <input
                                    type="text"
                                    name = "email"
                                    onChange = {handleFormChange}
                                    placeholder="abc@gmail.com"/>
                            </div>
                            <p>{serverMessage}</p>
                            {/*Appear after the user enter their email*/}
                            {!signInStatus === "checkingEmail" && <div className="input-cover">
                                <FontAwesomeIcon icon={faKey} className="input-icon" size="lg"/>
                                <input
                                    name="verification_code"
                                    onChange = {handleFormChange}
                                    type="text"
                                    placeholder="verification code"
                                />
                            </div>}

                            {/*Appear after the user enter their email and want to register account*/}
                            { signInStatus === "registerRequired" && <div className="input-cover">
                                <FontAwesomeIcon icon={faUser} className="input-icon" size="lg"/>
                                <input
                                    name="name"
                                    onChange = {handleFormChange}
                                    type="text"
                                    placeholder="name"
                                />
                            </div>}
                            <button>Sign in</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;