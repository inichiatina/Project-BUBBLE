import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { registerUser } from "../services/authService";
import bilhete from "/Perfil_imgs/bilhete_login.png";
import "./Registo.css";

export default function Registo() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/profile");
    }, [user]);

    async function handleRegister(e) {
        e.preventDefault();

        try {
            await registerUser(email, password, nome);
            navigate("/profile");
        } catch (error) {
            console.error("Erro no Firebase:", error);

            // 1. Define a mensagem com base no código de erro
            let mensagemErro = "Ocorreu um erro ao criar a conta. Tenta novamente.";

            if (error.code === "auth/weak-password") {
                mensagemErro = "Atenção: A password deve ter pelo menos 6 caracteres!";
            } else if (error.code === "auth/email-already-in-use") {
                mensagemErro = "Atenção: Este email já está associado a uma conta.";
            } else if (error.code === "auth/invalid-email") {
                mensagemErro = "Atenção: O formato do email introduzido não é válido.";
            }

            // 2. Abre a janela de alerta do Windows/Navegador
            alert(mensagemErro);
        }
    }


    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <div className="login-page-reg">
            <div className="login-bilhete-wrapper">
                <img src={bilhete} className="login-bilhete-img" />
                <div className="login-bilhete-content">
                    <h1>Criar Conta</h1>
                    <form onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Nome"
                            onChange={(e) => setNome(e.target.value)}
                        />
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
                            <button type="submit">Criar Conta</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="login-footer">
                Já tens conta? <Link to="/login">Entrar</Link>
            </div>
        </div>
    );
}
