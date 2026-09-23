import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2Callback() {
    const navigate = useNavigate();
    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) {
            return;
        }

        processed.current = true;

        const handleGoogleLogin = () => {
            const hash = window.location.hash;

            console.log("OAuth callback hash:", hash);

            if (!hash) {
                console.error("No token found in URL");
                navigate("/login", { replace: true });
                return;
            }

            const params = new URLSearchParams(hash.substring(1));
            const token = params.get("token");

            console.log("Google token received:", !!token);

            if (!token) {
                console.error("Token parameter missing");
                navigate("/login", { replace: true });
                return;
            }

            try {
                const payloadPart = token.split(".")[1];

                if (!payloadPart) {
                    throw new Error("Invalid JWT");
                }

                const base64 = payloadPart
                    .replace(/-/g, "+")
                    .replace(/_/g, "/");

                const paddedBase64 =
                    base64 +
                    "=".repeat((4 - (base64.length % 4)) % 4);

                const payload = JSON.parse(
                    atob(paddedBase64)
                );

                console.log("Google JWT payload:", payload);

                const role = payload.role;

                if (!role) {
                    throw new Error("Role missing from JWT");
                }

                localStorage.setItem("token", token);
                localStorage.setItem("role", role);

                console.log("Token saved");
                console.log("Role saved:", role);

                window.history.replaceState(
                    null,
                    "",
                    window.location.pathname
                );

                if (role === "ADMIN") {
                    navigate("/dashboard", {
                        replace: true
                    });
                } else if (role === "USER") {
                    navigate("/candidate-dashboard", {
                        replace: true
                    });
                } else {
                    throw new Error(
                        `Unknown role: ${role}`
                    );
                }

            } catch (error) {
                console.error(
                    "Google OAuth callback failed:",
                    error
                );

                localStorage.removeItem("token");
                localStorage.removeItem("role");

                navigate("/login", {
                    replace: true
                });
            }
        };

        handleGoogleLogin();
    }, [navigate]);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px"
            }}
        >
            Signing you in with Google...
        </div>
    );
}

export default OAuth2Callback;