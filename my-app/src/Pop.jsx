import { useEffect, useRef, useState } from "react";
import { useAuth } from "./Context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { addMovieToList, removeMovieFromList, getFilmeListas } from "./services/userService.js";
import OndeVer from "/src/onde_ver_pop.jsx";
import AnimaPop from "./entrada_pop.jsx";
import gsap from "gsap";
import "./Pop.css";

export default function Pop() {
    const navigate = useNavigate();

    const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGVjMTg3YzgzZDEwNjczOTA0ODI1NzdlOTg0NzVlOCIsIm5iZiI6MTc3ODc3MzQzNS44MzM5OTk5LCJzdWIiOiI2YTA1ZWRiYjVkZDUzNmMzZGUyOTFlMTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.WeqAL5AOhmq7f3u3cnezHZm2uwskFkbKLWhKpa0IzjM";

    const { user, loading: authLoading } = useAuth();
    const hintRef = useRef(null);

    const [genres, setGenres] = useState([]); //lista os géneros da api
    const [selected, setSelected] = useState([]); //géneros que o utilizador clicou
    const [movie, setMovie] = useState(null); //filme recomendado
    const [loading, setLoading] = useState(false);  //botão do loading - talvez tirar
    const [showInfo, setShowInfo] = useState(false);  //como funciona o pop the bubble

    const fieldRef = useRef(null);
    const [started, setStarted] = useState(false);

    const [filmeListas, setFilmeListas] = useState({
        filmesVistos: false,
        favoritos: false,
        popTheBubble: false,
    });
    const [saving, setSaving] = useState(false);

    const bubblesRef = useRef([]); //usado para a animação 
    const availableRef = useRef([]); //evita bolhas com generos repetidos 
    const rafRef = useRef(null); // cancela o loop
    const [, forceRender] = useState(0); //força o render

    const oppositeGenres = {
        Action: "Drama",
        Adventure: "Romance",
        Animation: "Horror",
        Comedy: "Thriller",
        Crime: "Family",
        Documentary: "Action",
        Drama: "Comedy",
        Family: "Crime",
        Fantasy: "Thriller",
        History: "Animation",
        Horror: "Comedy",
        Music: "War",
        Mystery: "Romance",
        Romance: "Thriller",
        Thriller: "Family",
        War: "Comedy",
        Western: "Animation",
    };


    //função que vai buscar os generos à api e guarda-os
    useEffect(() => {
        if (!user) return;

        async function fetchGenres() {
            if (!TOKEN) return; //certifica que tem o codigo da api

            const res = await fetch(
                "https://api.themoviedb.org/3/genre/movie/list?language=en",  //lista de géneros
                {
                    headers: {
                        accept: "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

            const data = await res.json();

            setGenres(data.genres || []);  //guarda os géneros
            availableRef.current = data.genres || [];  //vai checkar os generos de bolhas
        }

        fetchGenres();
    }, []);

    // retira um género random da lista de genros e atualiza oa vailable para que sejam evitadas bolhas duplicadas
    function spawnBubble() {
        const pool = availableRef.current;
        if (!pool.length) return;

        const g = pool[Math.floor(Math.random() * pool.length)]; //vai buscr um genero aleatorio
        availableRef.current = pool.filter(x => x.id !== g.id);  //evita duplicados

        //posições das bolhas 
        let tx, ty;
        let valid = false;  //destino final da bolha

        while (!valid) {  //procura espaço para meter a bolha
            tx = 10 + Math.random() * 80;
            ty = 15 + Math.random() * 60;

            valid = true;

            for (const other of bubblesRef.current) { //verifica que outras bolhas existem
                if (other.tx == null || other.ty == null) continue;

                const dx = tx - other.tx;
                const dy = ty - other.ty;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 14) { //distancia entre bolhas e se for menor do que 14 não deixa
                    valid = false;
                    break;
                }
            }
        }

        //empurra as bolhas para o sitio
        bubblesRef.current.push({ //nasce a bolha
            ...g,  //genero
            uid: crypto.randomUUID(),

            x: 90, //nasce no canto inferior direito
            y: 60,

            vx: (Math.random() - 0.5) * 0.3,
            vy: -0.8 - Math.random() * 0.4, //movimento inicial

            size: 80 + Math.random() * 40,  //tamanho das bolhas
            phase: Math.random() * Math.PI * 2,

            tx,
            ty, //destino final
        });
    }

    //movimento das bolhas
    const update = () => { //flow da bolha constante
        const t = Date.now() * 0.001;

        for (const b of bubblesRef.current) {

            // bolha a subir
            b.vy -= 0.008;

            // variação de mocimento para nunca estar parada
            b.vx += (Math.random() - 0.5) * 0.004;
            b.vy += (Math.random() - 0.5) * 0.003;

            //suaviza o movimento até ao destino
            b.x += (b.tx - b.x) * 0.02;
            b.y += (b.ty - b.y) * 0.02;

            // mistura com movimento físico 
            b.x += b.vx;
            b.y += b.vy;

            // damping
            b.vx *= 0.96;
            b.vy *= 0.97;

            //flutuação constante«
            b.renderY = b.y + Math.sin(t * 1.5 + b.phase) * 0.5;
        }

        forceRender(v => v + 1);
        rafRef.current = requestAnimationFrame(update);
    };

    //ativação dos loops
    useEffect(() => {
        if (!user) return;
        rafRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(rafRef.current);
    }, [user]);

    //velocidade das bolhas a voar
    useEffect(() => {
        if (!user || !started) return;

        //nasce uma bolha a cada 0.6 segundos
        const interval = setInterval(() => {
            spawnBubble();
        }, 600);

        return () => clearInterval(interval);
    }, [user, started]);

    //ao selecionar uma bolha dependendo se o utilizador já tinha ou nao selecionado a bolha muda o seu estado
    function toggle(g) {
        setSelected(prev => {
            const exists = prev.find(x => x.id === g.id);
            if (exists) return prev.filter(x => x.id !== g.id);
            return [...prev, g];
        });
    }

    //transforma os generos selecionados nos seus opostos e procura os ids correspondentes ao generos
    async function recommend() {
        if (!TOKEN) {
            return;
        }

        if (selected.length === 0) {
            alert("Seleciona pelo menos uma bolha antes de fazeres Pop!");
            return;
        }

        try {
            setLoading(true);


            const oppositeSelectedGenres = selected
                .map(g => oppositeGenres[g.name])   // converte para oposto
                .filter(Boolean);                  // remove undefined

            // converte nomes para ids
            const oppositeGenreIds = genres
                .filter(g => oppositeSelectedGenres.includes(g.name))
                .map(g => g.id)
                .join(",");

            const endpoint =
                oppositeGenreIds.length > 0
                    ? `https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&with_genres=${oppositeGenreIds}`
                    : `https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`;

            const res = await fetch(endpoint, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${TOKEN}`,
                },
            });

            const data = await res.json();

            if (!data.results || data.results.length === 0) {
                setMovie(null);
                return;
            }

            const randomMovie =
                data.results[
                Math.floor(Math.random() * data.results.length)
                ];

            setMovie(randomMovie);

            //adiciona o filme ao pop the bubble se o utilizador estiver logado
            if (user) {
                const filmeParaGuardar = {
                    id: randomMovie.id,
                    title: randomMovie.title,
                    poster: randomMovie.poster_path,
                    year: randomMovie.release_date?.split("-")[0] || "",
                    genre_ids: randomMovie.genre_ids,
                };
                await addMovieToList(user.uid, "popTheBubble", filmeParaGuardar);

                // vai buscar estado atual das outras listas
                const listas = await getFilmeListas(user.uid, randomMovie.id);
                setFilmeListas({ ...listas, popTheBubble: true });
            }


        } finally {
            setLoading(false);
        }
    }

    // permite que o utilizador possa adicionar ou remover filmes das suas listas ao selecionar os respetivos botoes
    async function toggleLista(listaKey) {
        if (!user) {
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        const filmeParaGuardar = {
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path,
            year: movie.release_date?.split("-")[0] || "",
            genre_ids: movie.genre_ids,
        };

        if (filmeListas[listaKey]) {
            await removeMovieFromList(user.uid, listaKey, movie.id);
            setFilmeListas(prev => ({ ...prev, [listaKey]: false }));
        } else {
            await addMovieToList(user.uid, listaKey, filmeParaGuardar);
            setFilmeListas(prev => ({ ...prev, [listaKey]: true }));
        }
        setSaving(false);
    }

    function closeMovie() {
        setMovie(null);
        setSelected([]);
    }

    function openInfo() {
        setShowInfo(true);
    }

    function closeInfo() {
        setShowInfo(false);
    }

    //com o gsap ele verifica o scroll do utilizador e quando passar de x tamanho do ecra ele dispara as bolhas
    useEffect(() => {
        gsap.to(hintRef.current?.firstChild, {
            y: 15,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "power1.inOut"
        });
    }, []);

    useEffect(() => {
        if (!fieldRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started) {
                    setStarted(true);
                    observer.disconnect(); // só acontece uma vez
                }
            },
            { threshold: 0.2 } // ativa quando 20% do field aparece
        );

        const currentField = fieldRef.current;
        observer.observe(currentField);

        return () => observer.unobserve(currentField);
    }, [started]);

    if (!user) {
        return (
            <div className="page-wrapper-blocked-popbubble">
                <div className="blocked-message-popbubble">
                    <h2>Acesso Restrito</h2>
                    <p>Precisas de ter uma conta activa e fazer login para poderes dar "Pop" nas tuas bolhas!</p>

                    <div className="auth-actions-popbubble">
                        <button
                            className="button-popbubble login-btn-popbubble"
                            onClick={() => navigate("/login")}
                        >
                            Fazer Login
                        </button>

                        <button
                            className="button-popbubble register-btn-popbubble"
                            onClick={() => navigate("/register")}
                        >
                            Criar Conta
                        </button>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="page-wrapper-popbubble">

            <AnimaPop />

            <div
                ref={hintRef}
                style={{
                    position: "absolute",
                    top: "200px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#F0F2EE",
                    textAlign: "center",
                    zIndex: 20,
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        fontSize: "3rem",
                        marginBottom: "10px",
                    }}
                >
                    ↓
                </div>

                <div
                    style={{
                        fontSize: "1rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        paddingTop: "15px",
                    }}
                >
                    Faz scroll para descobrir
                </div>
            </div>



            {/* botão info */}
            <div className="controls-top-popbubble">
                <button className="button-P-popbubble" onClick={openInfo}>
                    ?
                </button>
            </div>

            <div className="pop-container-popbubble">
                <div />

                <div className="field-popbubble" ref={fieldRef}>
                    {bubblesRef.current.map(b => {
                        const isSelected = selected.find(s => s.id === b.id);

                        return (
                            <div
                                key={b.uid}
                                className="bubble-popbubble"
                                onClick={() => toggle(b)}
                                style={{
                                    left: `${b.x}%`,
                                    top: `${b.renderY ?? b.y}%`,
                                    width: b.size,
                                    height: b.size,
                                    position: "absolute",
                                }}
                            >
                                <img
                                    src={
                                        isSelected
                                            ? "/svgs_pop_bubble/bolha_rosa.svg"
                                            : "/svgs_pop_bubble/bolha_azul.svg"
                                    }
                                    className="bubble-img-popbubble"
                                    alt="bubble"
                                />
                                <span className={`label-popbubble ${isSelected ? "selected-popbubble" : ""}`}>
                                    {b.name}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* botão pop*/}
                {selected.length > 0 && (
                    <div className="controls-bottom-popbubble">
                        <button className="button-popbubble" onClick={recommend}>
                            {loading ? "Loading..." : "Pop the Bubble"}
                        </button>
                    </div>
                )}

                {movie && (
                    <div className="movie-popbubble">

                        <button className="close-btn-popbubble" onClick={closeMovie}>
                            X
                        </button>
                        <div className="img-capa-popbubble">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt="poster"
                            />
                        </div>

                        <div>
                            <h2>{movie.title}</h2>
                            <p>{movie.overview}</p>


                            {/* listas*/}
                            <div className="movie-listas-popbubble">
                                <p className="movie-listas-label-popbubble">Adicionar a:</p>

                                <button
                                    className={`lista-pill-popbubble ${filmeListas.filmesVistos ? "ativa-popbubble" : ""}`}
                                    onClick={() => toggleLista("filmesVistos")}
                                    disabled={saving}
                                >
                                    {filmeListas.filmesVistos ? "✓ Já Vi" : "+ Já Vi"}
                                </button>

                                <button
                                    className={`lista-pill-popbubble ${filmeListas.favoritos ? "ativa-popbubble" : ""}`}
                                    onClick={() => toggleLista("favoritos")}
                                    disabled={saving}
                                >
                                    {filmeListas.favoritos ? "✓ Favoritos" : "+ Favoritos"}
                                </button>

                                <button
                                    className={`lista-pill-popbubble ativa-popbubble`}
                                    disabled
                                >
                                    ... Pop the Bubble
                                </button>
                            </div>

                            <div className="imagem-onde-ver-popbubble">
                                <OndeVer title={movie.title} />
                            </div>
                        </div>
                    </div>
                )}

                {showInfo && (
                    <div className="info-box-popbubble">
                        <button className="info-bot-popbubble" onClick={closeInfo}>
                            X
                        </button>

                        <h3>O que é o 'Pop the Bubble'?</h3>
                        <p className="explicajfbvrivwb-popbubble">
                            'Pop the Bubble' é um algoritmo inverso que tem como objetivo incentivar a saída da tua bolha de interesses. Se costumas consumir conteúdo relacionado com 'Comédia' o filtro irá recomendar filmes de 'Thriller' e outros géneros opostos aquele que costumas consumir.
                            Para utilizar o filtro selecionas as bolhas com os géneros que mais consumes e selecionas o botão 'Pop the Bubble' e aguardas a recomendação do teu filme.
                            Depois é só vê-lo e expandir os teus interesses!
                        </p>
                        <img
                            src="/svg_extra/Mascote_fita cinema.svg"
                            className="info-masc-popbubble"
                            alt="mascote"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}