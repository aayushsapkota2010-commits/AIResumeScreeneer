import { useEffect, useState } from "react";
import { Mail, Shield, User } from "lucide-react";
import api from "../api/api";
import "./UserProfile.css";

function UserProfile() {
    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        role: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/user/profile");

            setProfile({
                fullName: response.data.fullName || "",
                email: response.data.email || "",
                role: response.data.role || ""
            });

            if (response.data.fullName) {
                localStorage.setItem(
                    "name",
                    response.data.fullName
                );
            }

            if (response.data.role) {
                localStorage.setItem(
                    "role",
                    response.data.role
                );
            }
        } catch (err) {
            console.error("Failed to load profile:", err);
            setError("Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    if (loading) {
        return (
            <div className="user-profile-page">
                <div className="user-profile-loading">
                    Loading profile...
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile-page">

            <div className="user-profile-header">
                <div>
                    <p className="user-profile-eyebrow">
                        ACCOUNT
                    </p>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        View your account information and profile details.
                    </p>
                </div>
            </div>

            {error && (
                <div className="user-profile-error">
                    {error}
                </div>
            )}

            <div className="user-profile-card">

                <div className="user-profile-card-top">

                    <div className="user-profile-avatar">
                        {getInitials(profile.fullName)}
                    </div>

                    <div className="user-profile-identity">
                        <h2>
                            {profile.fullName || "User"}
                        </h2>

                        <span>
                            {profile.role || "User"}
                        </span>
                    </div>

                </div>

                <div className="user-profile-divider" />

                <div className="user-profile-info">

                    <div className="user-profile-info-item">
                        <div className="user-profile-icon">
                            <User size={18} />
                        </div>

                        <div>
                            <span className="user-profile-label">
                                Full Name
                            </span>

                            <strong>
                                {profile.fullName || "Not available"}
                            </strong>
                        </div>
                    </div>

                    <div className="user-profile-info-item">
                        <div className="user-profile-icon">
                            <Mail size={18} />
                        </div>

                        <div>
                            <span className="user-profile-label">
                                Email Address
                            </span>

                            <strong>
                                {profile.email || "Not available"}
                            </strong>
                        </div>
                    </div>

                    <div className="user-profile-info-item">
                        <div className="user-profile-icon">
                            <Shield size={18} />
                        </div>

                        <div>
                            <span className="user-profile-label">
                                Account Role
                            </span>

                            <strong>
                                {profile.role || "User"}
                            </strong>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default UserProfile;