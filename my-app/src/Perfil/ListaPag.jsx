import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { getUserProfile } from "../services/userService";
import { getGenres, getPosterUrl } from "../services/movieService";
import FilmeDetalhePopup from "../Componentes/MoviePopUp.jsx";
import MovieSearchPopup from "../Componentes/SearchMovie.jsx";

import "./ListaPag.css";

const CONFIG = {
    filmesVistos: { titulo: "Filmes Já Vistos", cor: "#EEE" },
    favoritos: { titulo: "Filmes Favoritos", cor: "#EEE" },
    popTheBubble: { titulo: "Pop the Bubble", cor: "#EEE" },
};

export default function ListaPag() {
    const { tipo } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [filmeAtivo, setFilmeAtivo] = useState(null);
    const [filmes, setFilmes] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [dropdownAberto, setDropdownAberto] = useState(false);

    const [searchPopupAberto, setSearchPopupAberto] = useState(false);

    const dropdownRef = useRef(null);
    const config = CONFIG[tipo] || CONFIG.filmesVistos;

    // função isolada para carregar os dados e reutilizar ao atualizar as listas
    async function loadProfileMovies() {
        if (!user) return;
        setLoading(true);
        setSelectedGenre(null);
        setActiveIndex(0);
        const [perfil, genreList] = await Promise.all([
            getUserProfile(user.uid),
            getGenres(),
        ]);
        setFilmes(perfil?.[tipo] || []);
        setGenres(genreList);
        setLoading(false);
    }

    useEffect(() => {
        loadProfileMovies();
    }, [user, tipo]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    useEffect(() => {
        function handleClickFora(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickFora);
        return () => document.removeEventListener("mousedown", handleClickFora);
    }, []);

    const filmesFiltrados = selectedGenre
        ? filmes.filter((f) => f.genre_ids?.includes(selectedGenre))
        : filmes;

    useEffect(() => { setActiveIndex(0); }, [selectedGenre]);

    useEffect(() => {
        function handleTeclado(e) {
            if (filmesFiltrados.length === 0) return;

            if (e.key === "ArrowLeft") {
                prevMovie();
            } else if (e.key === "ArrowRight") {
                nextMovie();
            }
        }

        window.addEventListener("keydown", handleTeclado);
        return () => window.removeEventListener("keydown", handleTeclado);
    }, [filmesFiltrados, activeIndex]);

    const genresDisponiveis = genres.filter((g) =>
        filmes.some((f) => f.genre_ids?.includes(g.id))
    );

    const prevMovie = () =>
        setActiveIndex((i) => (i === 0 ? filmesFiltrados.length - 1 : i - 1));

    const nextMovie = () =>
        setActiveIndex((i) => (i === filmesFiltrados.length - 1 ? 0 : i + 1));

    const genreAtivo = genres.find((g) => g.id === selectedGenre);
    const filmeAtual = filmesFiltrados[activeIndex];

    const mostrarBotaoAdicionar = tipo === "favoritos" || tipo === "filmesVistos";

    return (
        <div className="page-listapag">
            <div className="bg-listapag" />

            {/* HEADER */}
            <header className="header-listapag">
                <button className="back-listapag" onClick={() => navigate("/profile")}>
                    <p className="ba-listapag"> Voltar </p>
                </button>
                <div className="titles-listapag">
                    <h1>{config.titulo}</h1>
                    <span className="count-listapag">
                        {filmesFiltrados.length}
                        {selectedGenre ? ` de ${filmes.length}` : ""} filmes
                        {genreAtivo ? ` · ${genreAtivo.name}` : ""}
                    </span>
                </div>
            </header>

            {/* CONTEÚDO PRINCIPAL */}
            {loading ? (
                <div className="loading-listapag">A carregar...</div>
            ) : filmesFiltrados.length === 0 ? (
                <div className="empty-listapag">
                    {filmes.length === 0
                        ? "Ainda não adicionaste filmes a esta lista."
                        : "Nenhum filme deste género na lista."}
                </div>
            ) : (
                <main className="content-listapag">
                    {/* CAROUSEL APENAS COM OS POSTERS */}
                    <div className="carousel-listapag">
                        <button className="btn-listapag prev" onClick={prevMovie}>◀</button>

                        <div className="track-listapag">
                            {filmesFiltrados.map((filme, index) => {
                                let cardStatusClass = "hidden-listapag";
                                if (index === activeIndex) cardStatusClass = "center-listapag";
                                else if (index === (activeIndex - 1 + filmesFiltrados.length) % filmesFiltrados.length)
                                    cardStatusClass = "left-listapag";
                                else if (index === (activeIndex + 1) % filmesFiltrados.length)
                                    cardStatusClass = "right-listapag";

                                return (
                                    <div
                                        key={filme.id}
                                        className={`card-listapag ${cardStatusClass}`}
                                        onClick={() => {
                                            if (cardStatusClass === "left-listapag") prevMovie();
                                            if (cardStatusClass === "right-listapag") nextMovie();
                                            if (cardStatusClass === "center-listapag") setFilmeAtivo(filme);
                                        }}
                                        style={{
                                            cursor: cardStatusClass !== "hidden-listapag" ? "pointer" : "default"
                                        }}
                                    >
                                        <img src={getPosterUrl(filme.poster)} alt={filme.title} />
                                    </div>
                                );
                            })}
                        </div>

                        <button className="btn-listapag next" onClick={nextMovie}>▶</button>
                    </div>

                    {/* INFORMAÇÃO DO FILME ATIVO FIXA ABAIXO */}
                    {filmeAtual && (
                        <div className="info-listapag">
                            <h2>{filmeAtual.title}</h2>
                            <p>
                                {genres
                                    .filter((g) => filmeAtual.genre_ids?.includes(g.id))
                                    .map((g) => g.name)
                                    .join(", ")} · {filmeAtual.year}
                            </p>
                        </div>
                    )}
                </main>
            )}

            {/* BOTÕES DE AÇÃO FLUTUANTES (FILTRO E ADICIONAR) */}
            <div className="actions-wrapper-listapag">
                {/* BOTÃO ADICIONAR FILME CONDICIONAL */}
                {mostrarBotaoAdicionar && (
                    <button
                        className="add-movie-btn-listapag"
                        onClick={() => setSearchPopupAberto(true)}
                        aria-label="Adicionar Filme"
                    >
                        <span className="add-icon-text">+</span>
                    </button>
                )}

                {/* botão de filtro*/}
                {genresDisponiveis.length > 0 && (
                    <div className="filter-wrapper-listapag" ref={dropdownRef}>
                        {dropdownAberto && (
                            <div className="dropdown-listapag">
                                <button
                                    className={`option-listapag ${!selectedGenre ? "active-listapag" : ""}`}
                                    onClick={() => {
                                        setSelectedGenre(null);
                                        setDropdownAberto(false);
                                    }}
                                >
                                    Todos
                                </button>
                                {genresDisponiveis.map((g) => (
                                    <button
                                        key={g.id}
                                        className={`option-listapag ${selectedGenre === g.id ? "active-listapag" : ""}`}
                                        onClick={() => {
                                            setSelectedGenre(selectedGenre === g.id ? null : g.id);
                                            setDropdownAberto(false);
                                        }}
                                    >
                                        {g.name}
                                    </button>
                                ))}
                            </div>
                        )}
                        <button
                            className={`filter-btn-listapag ${dropdownAberto ? "open-listapag" : ""}`}
                            onClick={() => setDropdownAberto(!dropdownAberto)}
                            aria-label="Filtrar Géneros"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="filter-icon-svg"
                            >
                                <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* pop de detalhe de filme que já está na lista*/}
            {filmeAtivo && (
                <FilmeDetalhePopup
                    filme={filmeAtivo}
                    tipo={tipo}
                    userId={user.uid}
                    onClose={() => setFilmeAtivo(null)}
                    onRemoved={() => {
                        setFilmes((prev) => prev.filter((f) => f.id !== filmeAtivo.id));
                        setFilmeAtivo(null);
                    }}
                />
            )}

            {/* pop up para pesquisar filmes*/}
            {searchPopupAberto && (
                <MovieSearchPopup
                    onClose={() => setSearchPopupAberto(false)}
                    onListasUpdate={loadProfileMovies} // atualiza a lista em segundo plano
                />
            )}
        </div>
    );
}
