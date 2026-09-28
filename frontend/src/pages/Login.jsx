import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const login = async (e) => {

        e.preventDefault();

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    email: email.trim(),
                    password
                }
            );

            const token = response.data;

            if (!token) {
                throw new Error("Token not received");
            }

            const payloadPart = token.split(".")[1];

            const base64 = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedBase64 =
                base64 +
                "=".repeat(
                    (4 - (base64.length % 4)) % 4
                );

            const payload = JSON.parse(
                atob(paddedBase64)
            );

            const role = payload.role;

            if (!role) {
                throw new Error("Role not found");
            }

            localStorage.setItem("token", token);
localStorage.setItem("role", role);
localStorage.setItem("email", email.trim());

            if (role === "ADMIN") {

                navigate("/dashboard", {
                    replace: true
                });

            } else if (role === "USER") {

                navigate("/candidate-dashboard", {
                    replace: true
                });

            } else {

                throw new Error("Invalid user role");

            }

        } catch (error) {

            console.error("Login error:", error);

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                setError(
                    "Invalid email or password. If you registered with Google, use Continue with Google."
                );

            } else {

                setError(
                    "Unable to login right now. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }
    };

    const googleLogin = () => {

        window.location.href =
            "http://localhost:8080/oauth2/authorization/google";

    };

    return (

        <div className="login-page">

            <div className="login-container">

                <div className="login-brand">

                    <div className="brand-icon">
                        AI
                    </div>

                    <h1>
                        Welcome back
                    </h1>

                    <p>
                        Sign in to your AI Resume Screener account
                    </p>

                </div>


                <div className="login-card">

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}


                    <form onSubmit={login}>

                        <div className="form-group">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                className="input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                            />

                        </div>


                        <div className="form-group">

                            <div className="form-label-row">

                                <label className="form-label">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-button"
                                    onClick={() =>
                                        alert(
                                            "Password reset will be available soon."
                                        )
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <input
                                className="input"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                            />

                        </div>


                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing in..."
                                : "Sign in"}
                        </button>

                    </form>


                    <div className="divider">

                        <div className="divider-line" />

                        <span className="divider-text">
                            OR
                        </span>

                        <div className="divider-line" />

                    </div>


                    <button
                        className="google-button"
                        type="button"
                        onClick={googleLogin}
                    >

                        <svg
                            className="google-icon"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="#4285F4"
                                d="M21.35 12.27c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42z"
                            />

                            <path
                                fill="#34A853"
                                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5z"
                            />

                            <path
                                fill="#FBBC05"
                                d="M6.54 13.58A5.86 5.86 0 0 1 6.23 12c0-.55.11-1.08.31-1.58V7.89H3.3A9.5 9.5 0 0 0 2.5 12c0 1.48.35 2.88.8 4.11l3.24-2.53z"
                            />

                            <path
                                fill="#EA4335"
                                d="M12 6.39c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.45 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 8.11 9.46 6.39 12 6.39z"
                            />
                        </svg>

                        Continue with Google

                    </button>


                    <p className="register-text">

                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="register-link"
                        >
                            Create account
                        </Link>

                    </p>

                </div>


                <div className="login-footer">
                    AI Resume Screener • Secure authentication
                </div>

            </div>

        </div>
    );
}

export default Login;