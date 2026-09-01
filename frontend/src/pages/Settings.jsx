import { useEffect, useState } from "react";
import api from "../api/api";
import "./Settings.css";

function Settings() {

    const [profile, setProfile] = useState({
        fullName: "",
        email: "",
        role: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Load current user
    useEffect(() => {

        const loadProfile = async () => {

            try {

                const response =
                    await api.get("/user/profile");

                setProfile(response.data);

            } catch (err) {

                console.log(err);

                setError("Failed to load profile.");

            } finally {

                setLoading(false);

            }
        };

        loadProfile();

    }, []);

    const handleProfileChange = (e) => {

        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });

    };

    const handlePasswordChange = (e) => {

        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value
        });

    };

    const saveProfile = async () => {

        setMessage("");
        setError("");

        try {

            setSaving(true);

            await api.put(
                "/user/profile",
                {
                    fullName: profile.fullName
                }
            );

            setMessage("Profile updated successfully.");

        } catch (err) {

            console.log(err);

            setError("Failed to update profile.");

        } finally {

            setSaving(false);

        }

    };

    const changePassword = async () => {

        setMessage("");
        setError("");

        if (
            !passwords.currentPassword ||
            !passwords.newPassword ||
            !passwords.confirmPassword
        ) {

            setError("Please fill all password fields.");

            return;

        }

        if (
            passwords.newPassword !==
            passwords.confirmPassword
        ) {

            setError("New passwords do not match.");

            return;

        }

        if (passwords.newPassword.length < 6) {

            setError(
                "New password must contain at least 6 characters."
            );

            return;

        }

        try {

            setChangingPassword(true);

            await api.put(
                "/user/change-password",
                {
                    currentPassword:
                        passwords.currentPassword,

                    newPassword:
                        passwords.newPassword
                }
            );

            setMessage(
                "Password changed successfully."
            );

            setPasswords({
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });

        } catch (err) {

            console.log(err);

            setError(
                "Failed to change password."
            );

        } finally {

            setChangingPassword(false);

        }

    };

    if (loading) {

        return (
            <div className="settings-page">
                <h2>Loading settings...</h2>
            </div>
        );

    }

    return (

        <div className="settings-page">

            <div className="settings-header">

                <div>

                    <p className="settings-eyebrow">
                        ACCOUNT
                    </p>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your profile and account preferences.
                    </p>

                </div>

            </div>

            {message && (
                <div className="settings-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="settings-error">
                    {error}
                </div>
            )}

            <div className="settings-grid">

                {/* PROFILE */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div>

                            <h2>
                                Profile Information
                            </h2>

                            <p>
                                Update your personal information.
                            </p>

                        </div>

                    </div>

                    <div className="settings-form">

                        <label>
                            Full Name
                        </label>

                        <input
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            placeholder="Enter your full name"
                        />

                        <label>
                            Email
                        </label>

                        <input
                            value={profile.email}
                            disabled
                        />

                        <label>
                            Role
                        </label>

                        <input
                            value={profile.role}
                            disabled
                        />

                        <button
                            className="settings-primary-btn"
                            onClick={saveProfile}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </section>


                {/* PASSWORD */}

                <section className="settings-card">

                    <div className="settings-card-header">

                        <div>

                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Keep your account secure with a strong password.
                            </p>

                        </div>

                    </div>

                    <div className="settings-form">

                        <label>
                            Current Password
                        </label>

                        <input
                            type="password"
                            name="currentPassword"
                            value={
                                passwords.currentPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter current password"
                        />

                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            name="newPassword"
                            value={
                                passwords.newPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Enter new password"
                        />

                        <label>
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            value={
                                passwords.confirmPassword
                            }
                            onChange={
                                handlePasswordChange
                            }
                            placeholder="Confirm new password"
                        />

                        <button
                            className="settings-primary-btn"
                            onClick={changePassword}
                            disabled={changingPassword}
                        >
                            {changingPassword
                                ? "Changing..."
                                : "Change Password"}
                        </button>

                    </div>

                </section>

            </div>

        </div>

    );

}

export default Settings;