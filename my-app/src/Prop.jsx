import { useEffect, useMemo, useState } from "react";
import moviesData from "./imdb_lista_filmes.json";
import "./Prop.css";

const MOVIES_PER_PAGE = 20;

const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGVjMTg3YzgzZDEwNjczOTA0ODI1NzdlOTg0NzVlOCIsIm5iZiI6MTc3ODc3MzQzNS44MzM5OTk5LCJzdWIiOiI2YTA1ZWRiYjVkZDUzNmMzZGUyOTFlMTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.WeqAL5AOhmq7f3u3cnezHZm2uwskFkbKLWhKpa0IzjM";

function extractImdbId(url) {
    if (!url) return null;
    const match = url.match(/tt\d+/);
    return match ? match[0] : null;
}

export default function Prop() {
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [tmdbCache, setTmdbCache] = useState({});
    const [search, setSearch] = useState("");
    const [genre, setGenre] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // corre o json e coloca os filmes nas suas respetivas listas
    useEffect(() => {
        setMovies(moviesData);
        setFilteredMovies(moviesData);
    }, []);

    //chama a api do imdb e procura o filme em questão e recolhe o poster oficial
    async function getTmdbDetails(imdbId) {
        if (!imdbId) return null;
        try {
            const response = await fetch(
                `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

            const data = await response.json();
            const movie = data.movie_results?.[0];
            const tv = data.tv_results?.[0];
            const result = movie || tv;

            if (!result) return null;

            return {
                posterUrl: result.poster_path
                    ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
                    : null,
                overview: result.overview || "Nenhuma sinopse disponível.",
            };
        } catch {
            return null;
        }
    }

    // filtro de filmes - monitoriza quando o utilizador muda o nome do filme ou o género
    useEffect(() => {
        const filtered = movies.filter((movie) => {
            const mSearch =
                movie.Title?.toLowerCase().includes(search.toLowerCase()) ||
                movie["Original Title"]?.toLowerCase().includes(search.toLowerCase());

            const mGenre =
                genre === "" ||
                (movie.Genres && movie.Genres.includes(genre));

            return mSearch && mGenre;
        });

        setFilteredMovies(filtered);
        setCurrentPage(1);
    }, [search, genre, movies]);

    // divide os géneros disponíveis
    const genres = useMemo(() => {
        const set = new Set();
        movies.forEach((movie) => {
            movie.Genres?.split(",").forEach((g) => set.add(g.trim()));
        });
        return [...set].sort();
    }, [movies]);

    const totalPages = Math.ceil(filteredMovies.length / MOVIES_PER_PAGE);

    // paginação dos filmes
    const currentMovies = useMemo(() => {
        const start = (currentPage - 1) * MOVIES_PER_PAGE;
        return filteredMovies.slice(start, start + MOVIES_PER_PAGE);
    }, [filteredMovies, currentPage]);

    // procura detalhes no TMDB de forma otimizada para a página atual - em vez de fazer diversos pedidos faz uma unica vez para os 20 filmes visiveis
    useEffect(() => {
        let isMounted = true;

        const loadTmdbData = async () => {
            const updates = {};
            for (const movie of currentMovies) {
                const imdbId = extractImdbId(movie.URL);
                if (!imdbId || tmdbCache[imdbId] || updates[imdbId]) continue;

                const details = await getTmdbDetails(imdbId);
                if (details) {
                    updates[imdbId] = details;
                }
            }

            if (Object.keys(updates).length > 0 && isMounted) {
                setTmdbCache((prev) => ({ ...prev, ...updates }));
            }
        };

        loadTmdbData();
        return () => { isMounted = false; };
    }, [currentMovies, tmdbCache]);

    //nr informativos no inicio da pagina
    const startIdx = filteredMovies.length > 0 ? (currentPage - 1) * MOVIES_PER_PAGE + 1 : 0;
    const endIdx = Math.min(currentPage * MOVIES_PER_PAGE, filteredMovies.length);

    return (
        <div className="app-wrapper-prop">
            <header className="main-header-prop">
                <div className="header-container-prop">

                    {/* Div apenas para o texto descritivo */}
                    <div className="notice-container-prop">
                        <p className="notice-text-prop">
                            Esta lista informativa reúne diversos filmes conhecidos que contêm elementos de propaganda. Para desenvolver o pensamento crítico, é essencial conhecer aquilo com que estamos a lidar.                        </p>
                    </div>

                    {/* Div apenas para os inputs de filtragem */}
                    <div className="filter-controls-prop">
                        <input
                            className="form-input-prop"
                            placeholder="Pesquisar por título..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <select
                            className="form-select-prop"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            <option value="">Todos os Géneros</option>
                            {genres.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                </div>
            </header>

            <main className="main-content-prop">
                <div className="results-counter-prop">
                    {filteredMovies.length === 0
                        ? "0 títulos encontrados"
                        : `A mostrar ${startIdx} - ${endIdx} de ${filteredMovies.length} títulos`}
                </div>

                <div className="movies-grid-prop">
                    {currentMovies.map((movie) => {
                        const imdbId = extractImdbId(movie.URL);
                        const details = tmdbCache[imdbId];

                        const rating = movie["IMDb Rating"]
                            ? Number(movie["IMDb Rating"]).toFixed(1)
                            : "N/A";

                        const year = movie.Year ? Math.floor(movie.Year) : "N/A";

                        return (
                            <div key={imdbId || movie.Title} className="movie-card-prop">
                                <img
                                    className="card-poster-img-prop"
                                    src={details?.posterUrl || "https://placehold.co/500x750/262626/#F0F2EE?text=Carregando..."}
                                    alt={movie.Title}
                                />

                                <div className="card-info-bar-prop">
                                    <div className="card-info-top-prop">
                                        <span className="movie-year-prop">{year}</span>
                                        <div className="rating-badge-prop">
                                            <span>⭐</span>
                                            <span className="rating-value-prop">{rating}</span>
                                        </div>
                                    </div>
                                    <h2 className="movie-title-prop">{movie.Title}</h2>
                                </div>

                                <a
                                    href={movie.URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="card-hover-overlay-prop"
                                >
                                    <div className="overlay-content-prop">
                                        <h3 className="overlay-title-prop">{movie.Title}</h3>
                                        <h4 className="overlay-section-title-prop">Sinopse</h4>
                                        <p className="overlay-description-prop">
                                            {details?.overview || movie.Description || "Sinopse não disponível."}
                                        </p>
                                    </div>
                                    <div className="imdb-button-prop">Ver no IMDb</div>
                                </a>
                            </div>
                        );
                    })}
                </div>

                {totalPages > 1 && (
                    <div className="pagination-container-prop">
                        <button
                            className="page-btn-prop ctrl-btn-prop"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            ◀
                        </button>

                        {(() => {
                            let pages = [];
                            if (totalPages <= 3) {
                                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                            } else if (currentPage <= 2) {
                                pages = [1, 2, 3];
                            } else if (currentPage >= totalPages - 1) {
                                pages = [totalPages - 2, totalPages - 1, totalPages];
                            } else {
                                pages = [currentPage - 1, currentPage, currentPage + 1];
                            }

                            return pages.map((page) => (
                                <button
                                    key={page}
                                    className={`page-btn-prop ${currentPage === page ? "active-prop" : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ));
                        })()}

                        <button
                            className="page-btn-prop ctrl-btn-prop"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            ▶
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}