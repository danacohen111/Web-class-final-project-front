import { useRef } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { loginUser, googleSignin, IUser } from "../../services/user-service";
import "./../../styles/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const emailInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const onLoginUser = async () => {
        if (emailInputRef.current?.value && passwordInputRef.current?.value) {
            const user: IUser = {
                email: emailInputRef.current?.value,
                password: passwordInputRef.current?.value
            };
            const res = await loginUser({ password: user.password, email: user.email });
            console.log(res);
            navigate("/home"); // TODO: Redirects to the homepage
        }
    };

    const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
        console.log(credentialResponse);
        try {
            const res = await googleSignin(credentialResponse);
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    };

    const onGoogleLoginFailure = () => {
        console.log("Google login failed");
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="title">SpotWise</h1>
                <p className="subtitle">Your Vision, The Perfect Location.</p>
                <p className="instruction">Sign in & Continue your journey</p>
                <input ref={emailInputRef} type="text" placeholder="Username" className="input-field" />
                <input ref={passwordInputRef} type="password" placeholder="Password" className="input-field" />
                <button className="signin-button" onClick={onLoginUser}>Sign in</button>
                <div className="google-login-container">
                    <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                </div>                
                <p className="signup-text">Don't have an account? <a href="/signup" className="signup-link">Sign Up</a></p>
            </div>
        </div>
    );
};

export default Login;
