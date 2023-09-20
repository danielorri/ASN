import { useState, useEffect } from "react";

const Login = () =>{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const cookies = document.cookie;
        const cookiesArray =cookies.split("; ");
        const cookiesStored = [];
        for(const cookie of cookiesArray){
            const [cookieName, cookieValue] = cookie.split("=");
            cookiesStored.push(cookieName);
            cookiesStored.push(cookieValue);
        }
        console.log(cookiesStored);
        if(cookiesStored.includes("username") && cookiesStored.includes("password") ){
            window.location.href="/dashboard";
        }

    }, [])

    const handleLogin = () =>{
        document.cookie = `username=${username}`;
        document.cookie = `password=${password}`;

        window.location.href = '/dashboard';
    };

    return(
        <div>
            <label htmlFor="username">Username</label>
            <input 
            type="text" 
            name="username"
            id="username"
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            autoComplete="true" />
            <label htmlFor="password">Password</label>
            <input 
            type="password" 
            name="password"
            id="password"
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            autoComplete="true" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;