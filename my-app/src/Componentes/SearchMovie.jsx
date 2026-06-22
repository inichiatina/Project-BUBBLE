import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getRandomMovies, searchMovies, getGenres, getMoviesByGenre, getPosterUrl } from "../services/movieService";
import { addMovieToList, removeMovieFromList, getFilmeListas } from "../services/userService";
import "./SearchMovie.css";

const LISTAS = [
    { key: "filmesVistos", label: "Já Vi" },
    { key: "favoritos", label: "Favoritos" },
    { key: "popTheBubble", label: "Pop the Bubble" },
];

export default function MovieSearchPopup({ onClose, onListasUpdate }) {
    const { user } = useAuth();

    const [filmes, setFilmes] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    // filme selecionado para ver detalhe/listas
    const [filmeAtivo, setFilmeAtivo] = useState(null);
    const [filmeListas, setFilmeListas] = useState({});
    const [saving, setSaving] = useState(false);

    //carrega géneros e filmes iniciais
    useEffect(() => {
        async function inicia() {
            setLoading(true);//inicio do loading
            const [g, f] = await Promise.all([getGenres(), getRandomMovies()]); //pesquisa os géneros e filmes ao mesmo tempo
            setGenres(g);
            setFilmes(f);
            setLoading(false);//fim do loading
        }
        inicia();
    }, []);

    //pesquisa sempre uq eo query mudar
    useEffect(() => {
        if (!query.trim()) return; //remove os espaços no inicio e fim das palavras e verifica se está vazia
        const t = setTimeout(async () => {
            setLoading(true);
            const res = await searchMovies(query);
            setFilmes(res);
            setSelectedGenre(null);
            setLoading(false);
        }, 400); //cria um temporizador - se o utilizador não tiver escrito mais nada depois de 4 segundos ele começa a pesquisar 
        return () => clearTimeout(t);
    }, [query]);

    //filtrar por género
    async function handleGenre(genreId) {
        if (selectedGenre === genreId) { //verifica o nr do id do genero e o utilizador ja tinha selecionado um novo genero
            // deseleciona - volta aos aleatórios
            setSelectedGenre(null);
            setQuery(""); //limpa pesquisa
            setLoading(true); //inicio do loading 
            const f = await getRandomMovies(); //vai buscar filmes random
            setFilmes(f); //atualiza a lista de filmes
            setLoading(false);//fim do loading
            return;
        }
        //o utilizador pode selecionar um genero novo
        setSelectedGenre(genreId);
        setQuery("");
        setLoading(true); //inicio do loading
        const f = await getMoviesByGenre(genreId);
        setFilmes(f);
        setLoading(false); //fim do loading
    }

    //abre detalhe do filme
    async function filmesProcurados(filme) {
        setFilmeAtivo(filme);
        const listas = await getFilmeListas(user.uid, filme.id);
        setFilmeListas(listas);
    }

    //seleção do estado dos filmes pelas listas - ou adiciono aos favoritos ou pop ou vistos
    async function seleLista(listaKey) {
        if (saving) return;
        setSaving(true);

        const filmeParaGuardar = {
            id: filmeAtivo.id,
            title: filmeAtivo.title,
            poster: filmeAtivo.poster_path,
            year: filmeAtivo.release_date?.split("-")[0] || "",
            genre_ids: filmeAtivo.genre_ids,
        };

        if (filmeListas[listaKey]) {
            await removeMovieFromList(user.uid, listaKey, filmeAtivo.id);
            setFilmeListas((prev) => ({ ...prev, [listaKey]: false }));
        } else {
            await addMovieToList(user.uid, listaKey, filmeParaGuardar);
            setFilmeListas((prev) => ({ ...prev, [listaKey]: true }));
        }

        // avisa o perfil para atualizar as estatiticas no bilhete do perfil
        onListasUpdate?.();
        setSaving(false);
    }

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>

                <button className="popup-close" onClick={onClose}>✕</button>

                {/* detalhe do filme*/}
                {filmeAtivo ? (
                    <div className="popup-detalhe">
                        <button className="popup-back" onClick={() => setFilmeAtivo(null)}>
                            ← Voltar
                        </button>
                        <div className="detalhe-conteudo">
                            <img
                                src={getPosterUrl(filmeAtivo.poster_path)}
                                className="detalhe-poster"
                            />
                            <div className="detalhe-info">
                                <h2>{filmeAtivo.title}</h2>
                                <p className="detalhe-ano">
                                    {filmeAtivo.release_date?.split("-")[0]}
                                </p>
                                <p className="detalhe-desc">{filmeAtivo.overview}</p>

                                <p className="detalhe-label">Adicionar a:</p>
                                <div className="detalhe-listas">
                                    {LISTAS.map((l) => (
                                        <button
                                            key={l.key}
                                            className={`lista-btn ${filmeListas[l.key] ? "ativa" : ""}`}
                                            onClick={() => seleLista(l.key)}
                                            disabled={saving}
                                        >
                                            {filmeListas[l.key] ? "✓ " : "+ "}
                                            {l.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* pesquisa */}
                        <div className="popup-header">
                            <h2>Descobre filmes</h2>
                            <input
                                className="popup-search"
                                type="text"
                                placeholder="Pesquisar filme..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        {/* generos*/}
                        <div className="popup-genres">
                            {genres.map((g) => (
                                <button
                                    key={g.id}
                                    className={`genre-btn ${selectedGenre === g.id ? "ativo" : ""}`}
                                    onClick={() => handleGenre(g.id)}
                                >
                                    {g.name}
                                </button>
                            ))}
                        </div>

                        {/* grelha filmes */}
                        {loading ? (
                            <div className="popup-loading">A carregar filmes...</div>
                        ) : (
                            <div className="popup-grid">
                                {filmes.map((f) => (
                                    <div
                                        key={f.id}
                                        className="popup-movie-card"
                                        onClick={() => filmesProcurados(f)}
                                    >
                                        <img
                                            src={getPosterUrl(f.poster_path)}
                                        />
                                        <p>{f.title}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}