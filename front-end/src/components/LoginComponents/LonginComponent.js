import React, { useState, useEffect } from "react";

const LoginComponent = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    useEffect(() => {
        const usernameCookie = document.cookie.split("; ").find(row => row.startsWith("username="));
        if (usernameCookie) {
            setUsername(decodeURIComponent(usernameCookie.split('=')[1]));
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = () => {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLoggedIn(false);
        setUsername("");
        window.location.href = '/';
    };

    return (
        <div>
            {isLoggedIn ? (
                <div>
                    <span>Welcome, {username}</span>
                    <button className="ms-2 btn btn-danger" onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <button className="btn btn-success" onClick={() => window.location.href = '/'}>Login</button>
            )}
        </div>
    );
};

export default LoginComponent;
