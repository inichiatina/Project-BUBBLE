import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { loginUser, loginGoogle } from "./services/authService";
import bilhete from "/Perfil_imgs/bilhete_login.png";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();


    //checka se o utilizador já tem o login feito e se tiver redireciona diretamente para a página de perfil
    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);


    //envia os estados de email e password
    async function handleLogin(e) {
        e.preventDefault();
        try {
            await loginUser(email, password);
        } catch (error) { }
    }

    //chama o login do google 
    async function handleGoogleLogin() {
        try {
            await loginGoogle();
            navigate("/profile");
        } catch (error) { }
    }

    //bloqueia o scroll da pagina e quando a pessoa sai para outra página o scroll é desbloqueado
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="login-page">
            <div className="login-bilhete-wrapper">
                <img src={bilhete} className="login-bilhete-img" />
                <div className="login-bilhete-content">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="login-botoes">
                            <button type="submit">Entrar</button>
                            <button type="button" onClick={handleGoogleLogin}>Entrar com Google</button>
                        </div>
                    </form>
                </div>
                <div className="logincriar-footer">
                    Ainda não tens conta?  <Link to="/register">Criar conta</Link>
                </div>
            </div>
        </div>
    );
}
