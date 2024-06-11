import { useState, useEffect } from "react";
import './Login.css'; // Ensure you have this CSS file in your project

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

    const handleLogin = () => {
        const validUsernames = [
            "victor.yanez@shamrockint.com", 
            "dione.heppner@shamrockint.com", 
            "geoff.speiden@shamrockint.com"
        ];
    
        // Convert both the input username and the valid usernames to lower case for case-insensitive comparison
        if (validUsernames.includes(username.toLowerCase())) {
            document.cookie = `username=${username}`;
            document.cookie = `password=${password}`;
    
            window.location.href = '/dashboard';
        } else {
            alert("Invalid username. Please reach out to Victor if you need access.");
        }
    };
    

    return(
        <div className="login-container">
        <div className="d-flex">
        <h2>Login</h2>
        <img style={{width: 25, height:25, borderRadius: 50}} src="https://media.licdn.com/dms/image/C510BAQEHZ44LPASmng/company-logo_200_200/0/1631374481581?e=2147483647&v=beta&t=iHa1euMrlayrSApuT9RDu-BRj3V47ExCIVdBj2oZqGM" alt="Shamrock Logo" />
        </div>
        <div className="login-form">
            <label htmlFor="username">Username</label>
            <input 
                type="text" 
                name="username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="true" 
            />
            <label htmlFor="password">Password</label>
            <input 
                type="password" 
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="true" 
            />
            <button onClick={handleLogin}>Login</button>
        </div>
        <p className="mt-2">Developed by Victor Y.</p>
    </div>
    );
}

export default Login;