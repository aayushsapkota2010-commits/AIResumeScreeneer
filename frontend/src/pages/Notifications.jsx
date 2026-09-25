import { useEffect, useState } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import api from "../api/api";

function Notifications() {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingRead, setMarkingRead] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await api.get("/notifications");

            setNotifications(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Failed to load notifications:",
                err
            );

            setError(
                "Unable to load notifications."
            );

        } finally {
            setLoading(false);
        }
    };

    const markAllAsRead = async () => {

        try {

            setMarkingRead(true);

            await api.put(
                "/notifications/read-all"
            );

            setNotifications((current) =>
                current.map((notification) => ({
                    ...notification,
                    read: true
                }))
            );

        } catch (err) {

            console.error(
                "Failed to mark notifications as read:",
                err
            );

        } finally {

            setMarkingRead(false);

        }
    };

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };

    return (
        <div
            style={{
                padding: "32px",
                maxWidth: "1000px",
                margin: "0 auto"
            }}
        >

            {/* HEADER */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "28px"
                }}
            >

                <div>
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#111827"
                        }}
                    >
                        Notifications
                    </h1>

                    <p
                        style={{
                            marginTop: "6px",
                            color: "#64748b",
                            fontSize: "14px"
                        }}
                    >
                        Stay updated with your application activity.
                    </p>
                </div>

                <button
                    onClick={markAllAsRead}
                    disabled={
                        markingRead ||
                        notifications.every(
                            (notification) =>
                                notification.read
                        )
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        border: "none",
                        background: "transparent",
                        color: "#4f46e5",
                        fontWeight: 600,
                        cursor: "pointer",
                        opacity: markingRead ? 0.6 : 1
                    }}
                >
                    {markingRead ? (
                        <Loader2
                            size={16}
                            className="spin"
                        />
                    ) : (
                        <CheckCheck size={16} />
                    )}

                    Mark all as read
                </button>

            </div>


            {/* ERROR */}

            {error && (
                <div
                    style={{
                        padding: "14px 16px",
                        marginBottom: "18px",
                        borderRadius: "10px",
                        background: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#b91c1c"
                    }}
                >
                    {error}
                </div>
            )}


            {/* LOADING */}

            {loading && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        padding: "60px",
                        color: "#64748b"
                    }}
                >
                    <Loader2
                        size={20}
                        className="spin"
                    />

                    Loading notifications...
                </div>
            )}


            {/* EMPTY */}

            {!loading &&
                !error &&
                notifications.length === 0 && (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "70px 20px",
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px"
                        }}
                    >

                        <Bell
                            size={42}
                            color="#94a3b8"
                        />

                        <h2
                            style={{
                                marginTop: "16px",
                                color: "#334155"
                            }}
                        >
                            No notifications
                        </h2>

                        <p
                            style={{
                                color: "#94a3b8"
                            }}
                        >
                            You're all caught up.
                        </p>

                    </div>
                )}


            {/* NOTIFICATIONS */}

            {!loading &&
                notifications.length > 0 && (

                    <div
                        style={{
                            background: "#ffffff",
                            border: "1px solid #e2e8f0",
                            borderRadius: "16px",
                            overflow: "hidden"
                        }}
                    >

                        {notifications.map(
                            (notification, index) => (

                                <div
                                    key={notification.id}
                                    style={{
                                        display: "flex",
                                        gap: "16px",
                                        padding: "20px",
                                        borderBottom:
                                            index <
                                            notifications.length - 1
                                                ? "1px solid #eef2f7"
                                                : "none",
                                        background:
                                            notification.read
                                                ? "#ffffff"
                                                : "#fafaff"
                                    }}
                                >

                                    {/* DOT */}

                                    <div
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            minWidth: "10px",
                                            marginTop: "7px",
                                            borderRadius: "50%",
                                            background:
                                                notification.read
                                                    ? "#cbd5e1"
                                                    : "#6366f1"
                                        }}
                                    />

                                    {/* CONTENT */}

                                    <div
                                        style={{
                                            flex: 1
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                gap: "20px"
                                            }}
                                        >

                                            <strong
                                                style={{
                                                    color: "#1e293b",
                                                    fontSize: "15px"
                                                }}
                                            >
                                                {notification.title}
                                            </strong>

                                            <span
                                                style={{
                                                    color: "#94a3b8",
                                                    fontSize: "12px",
                                                    whiteSpace:
                                                        "nowrap"
                                                }}
                                            >
                                                {formatTime(
                                                    notification.createdAt
                                                )}
                                            </span>

                                        </div>

                                        <p
                                            style={{
                                                margin:
                                                    "7px 0 0",
                                                color: "#64748b",
                                                lineHeight: 1.5,
                                                fontSize: "14px"
                                            }}
                                        >
                                            {notification.detail}
                                        </p>

                                    </div>

                                </div>

                            )
                        )}

                    </div>
                )}

        </div>
    );
}

export default Notifications;