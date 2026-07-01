import { useEffect, useState } from "react";
import { getMovieDetails, getPosterUrl } from "../services/movieService.js";
import { removeMovieFromList } from "../services/userService";
import "./MoviePopUp.css";

const LISTA_LABELS = {
    filmesVistos: "Já Vi",
    favoritos: "Favoritos",
    popTheBubble: "Pop the Bubble",
};

export default function FilmeDetalhePopup({ filme, tipo, userId, onClose, onRemoved }) { //recebe o filme, a lista em que se insere, id do user, fechar o verlay e retirar filmes das listas
    const [detalhes, setDetalhes] = useState(null); //guarda os detalhes dos filmes nome, runtime
    const [loading, setLoading] = useState(true); //está a carregar
    const [removendo, setRemoving] = useState(false); //guarda se o filme foi removido

    useEffect(() => {
        async function load() {
            setLoading(true); //estado do carregamento
            const data = await getMovieDetails(filme.id); //vai buscar os detalhes do filme via id do mesmo
            setDetalhes(data);//guarda os detalhes pedidos
            setLoading(false);//para de fazer loading
        }
        load();
    }, [filme.id]);

    async function handleRemover() {
        setRemoving(true); //remove o filme
        await removeMovieFromList(userId, tipo, filme.id); //procura pelo id do user, a lista em que o filme se encontra (vistos,favoritos, pop) e o id do filme
        onRemoved(); //avisa o componente pai (pagina da lista em que o filme estava) que foi removido
        onClose(); //fecha o pop up - só se pode remover os filmes das listas na página das mesmas então ao remove-lo tudo desaparece
    }

    //texto sinopse fala com a api para ir buscar a sinopse dos filmes
    let textoSinopse;

    if (detalhes?.overview) {
        textoSinopse = detalhes.overview;
    } else {
        textoSinopse = "Sinopse não disponível.";
    }


    return (
        <div className="detalhe-overlay" onClick={onClose}> {/*se selecionar fora do pop up ele fecha*/}
            <div className="detalhe-popup" onClick={(e) => e.stopPropagation()}> {/*ao clickar no popup não passa para o elemento pai*/}
                <button className="detalhe-fechar" onClick={onClose}>✕</button> {/*botão de close o*/}

                {loading ? (
                    <div className="detalhe-loading">A carregar...</div>
                ) : (
                    <div className="detalhe-body"> {/*if - se estiver a carregar aparece carregar se não aparece o popup*/}

                        {/* poster do filme*/}
                        <img
                            className="detalhe-poster"
                            src={getPosterUrl(detalhes.poster_path)}
                        />

                        {/* conteúdo do filme */}
                        <div className="detalhe-conteudo">
                            <h2 className="detalhe-titulo">{detalhes.title}</h2>

                            <div className="detalhe-meta">
                                <span>{detalhes.release_date?.split("-")[0]}</span>
                                <span>·</span>
                                <span>{detalhes.runtime} min</span>
                                <span>·</span>
                                <span>⭐ {detalhes.vote_average?.toFixed(1)}</span>
                            </div>

                            {/*array de generos da api*/}
                            <div className="detalhe-generos">
                                {detalhes.genres?.map((g) => (
                                    <span key={g.id} className="detalhe-genero-tag">
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            {/*sinopse dos filmes*/}
                            <p className="detalhe-sinopse">
                                {textoSinopse}
                            </p>

                            {detalhes.atores.length > 0 && (
                                <div className="detalhe-atores">
                                    <p className="detalhe-label">Atores</p>
                                    <div className="detalhe-atores-grid">
                                        {detalhes.atores.map((a) => (
                                            <div key={a.id} className="ator-card">
                                                <img
                                                    src={
                                                        a.profile_path
                                                            ? getPosterUrl(a.profile_path)
                                                            : "https://via.placeholder.com/80x80?text=?"
                                                    }
                                                />
                                                <p className="ator-nome">{a.name}</p>
                                                <p className="ator-personagem">{a.character}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                className="detalhe-remover"
                                onClick={handleRemover}
                                disabled={removendo}
                            >
                                {removendo ? "A remover..." : `Remover de "${LISTA_LABELS[tipo]}"`}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
