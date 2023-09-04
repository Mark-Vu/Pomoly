import homePageImage from '../../assets/images/homePageImage.png';
import studyHubLogo from '../../assets/images/studyHubLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKey } from "@fortawesome/free-solid-svg-icons";
import '../../assets/styles/homePage.css'

function HomePage() {
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
                        <form className="input-container">
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
                                <input type="text" placeholder="abc@gmail.com"/>
                            </div>
                            <div className="input-cover">
                                <FontAwesomeIcon icon={faKey} className="input-icon" size="lg"/>
                                {/*<img src={verificationCodeIcon} className="input-icon"></img>*/}
                                <input className="verification-code" type="text" placeholder="verification code"/>
                            </div>                                
                            <button >Sign in</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}
export default HomePage;