import { Link } from "react-router-dom";
import Estatistica from "./Estatistica";
import "./PerfilCard.css";

export default function PerfilCard({ utilizador }) {
    return (
        <div className="ticket">
            <div className="ticket-info">
                <h1 className="titulo-perfil">CINEMA TICKET</h1>

                <p className="nome">{utilizador.nome}</p>

                <div className="estatisticas">
                    <Link to="/lista/filmesVistos" className="link-filmes">
                        <Estatistica titulo="FILMES JÁ VISTOS" valor={utilizador.filmes} />
                    </Link>

                    <Link to="/lista/favoritos" className="link-filmes">
                        <Estatistica titulo="FILMES FAVORITOS" valor={utilizador.gostos} />
                    </Link>

                    <Link to="/lista/popTheBubble" className="link-filmes">
                        <Estatistica titulo="FILMES POP THE BUBBLE" valor={utilizador.popTheBubble} />
                    </Link>
                </div>
            </div>

            <div className="retangulo_avatar">
                <img src={utilizador.ret}/>
            </div>
            <div className="avatar">
                <img src={utilizador.avatar}/>
            </div>
        </div>
    );
}
