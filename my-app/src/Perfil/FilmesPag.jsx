import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../Componentes/MovieCard";
import filtroBtn from "/imgs/bolha_logo.png";
import "./FilmesPag.css";

export default function FilmesPag() {

    const [activeIndex, setActiveIndex] = useState(0); //guarda o indice do filme selecionado
    const navigate = useNavigate();

    //função chamada quando selecionada a seta para trás
    const prevMovie = () => { 
        setActiveIndex( //muda para o filme selecionado
            activeIndex === 0  //verifica se está no primeiro filme
                ? movies.length - 1 //se estiver no primeiro vou para o último
                : activeIndex - 1  //caso contrario vai para o anterior
        );
    };

     //função chamada quando selecionada a seta para frente
    const nextMovie = () => {
        setActiveIndex(
            activeIndex === movies.length - 1 //verifica se estou no ultimo
                ? 0 //se estiver volto ao primeiro
                : activeIndex + 1 // caso contrario ando um para a frente
        );
    };

    return (
        <div className="movies-page">

            <div className="background" />
            <button onClick={() => navigate("/profile")} className="back-button">
                ← Perfil
            </button>

            <div className="carousel">


                <button onClick={prevMovie}>
                    ◀
                </button>

                {movies.map((movie, index) => {

                    let className = "hidden";

                    if (index === activeIndex)
                        className = "center";

                    else if (
                        index ===
                        (activeIndex - 1 + movies.length) % movies.length
                    )
                        className = "left";

                    else if (
                        index ===
                        (activeIndex + 1) % movies.length
                    )
                        className = "right";

                    return (
                        <MovieCard
                            key={movie.id}
                            movie={movie}
                            className={className}
                        />
                    );
                })}

                <button onClick={nextMovie}>
                    ▶
                </button>

            </div>

            <button className="filter-btn">
                <img src={filtroBtn} />
            </button>

        </div>
    );
}
