import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const NotificationManager = () => {
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const requestNotificationPermission = async () => {
            if (!("Notification" in window)) {
                console.error("This browser does not support notifications.");
                return;
            }

            if (Notification.permission === "default") {
                console.log("Requesting notification permission...");
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === "granted") {
                        console.log("Notification permission granted.");
                    } else if (permission === "denied") {
                        console.warn("Notification permission denied.");
                    } else {
                        console.log("Notification permission dismissed.");
                    }
                } catch (error) {
                    console.error("Error requesting notification permission:", error);
                }
            } else if (Notification.permission === "granted") {
                console.log("Notification permission already granted.");
            } else if (Notification.permission === "denied") {
                console.warn("Notification permission was previously denied.");
            }
        };

        if (isLoggedIn) {
            requestNotificationPermission();
        }
    }, [isLoggedIn]);

    return null;
};

export default NotificationManager;