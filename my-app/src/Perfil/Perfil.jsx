import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getUserProfile } from "../services/userService";
import { logoutUser } from "../services/authService";
import claqueteperfil from "/Perfil_imgs/claquete_perfil2.png";
import retanguloperfil from "/Perfil_imgs/retangulo.png";
import PerfilCard from "../Componentes/PerfilCard";
import "./Perfil.css";

export default function Perfil() {
    const { user } = useAuth();
    const [utilizador, setUtilizador] = useState(null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/registo");
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const loadUser = useCallback(async () => {
        try {
            const data = await getUserProfile(user.uid);
            setUtilizador(data);
        } catch (error) { } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) loadUser();
    }, [user, loadUser]);

    if (loading || !utilizador) {
        return <div className="perfil-page"><h2>A carregar perfil...</h2></div>;
    }

    return (
        <div className="perfil-page">

            <button className="botao-logout" onClick={handleLogout}>
                <p className="but-log-out"> Log Out </p>
            </button>

            <PerfilCard
                utilizador={{
                    nome: utilizador.nome,
                    filmes: utilizador.filmesVistos?.length || 0,
                    gostos: utilizador.favoritos?.length || 0,
                    popTheBubble: utilizador.popTheBubble?.length || 0,
                    avatar: claqueteperfil,
                    ret: retanguloperfil,
                }}
            />

        </div>
    );
}
