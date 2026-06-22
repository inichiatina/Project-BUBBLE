import { useEffect, useRef, useState } from "react";
import "./Historia_cinema.css";
import eras from "./info_historia.js";

export default function Historia() {
    const sectionRef = useRef(null);
    const eraRefs = useRef([]);

    const [progress, setProgress] = useState(0);
    const [activeEra, setActiveEra] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {

        //Intersectionobserver é um api do navegador - espera que elementos especificos entrem numa area especifica do ecra para fazer x coisa
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {  //verifica se a era passu na zona configurada
                        const index = Number(entry.target.dataset.index);  //grava o numero da era ativa
                        setActiveEra(index);

                        const totalEras = eras.length;
                        const newProgress = ((index + 1) / totalEras) * 100;  //calcula o progresso do utilizador pelo nr de eras que já visualizou
                        setProgress(newProgress);

                        // se estiver na última era (index === totalEras - 1), mostra a seta
                        if (index === totalEras - 1) {
                            setShowScrollTop(true);
                        } else {
                            setShowScrollTop(false);
                        }
                    }
                });
            },
            {
                threshold: 0,
                rootMargin: "-40% 0px -40% 0px"  //o elemento só é ativado quando passar esta linha do ecrã
            }
        );

        //diz  ao observador para vigiar as eras e quando o utilizador sair da página é apagado
        eraRefs.current.forEach((section) => {
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    //função de return até ao topo da página
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <main className="historia-hist" ref={sectionRef}>
            <div className="timeline-hist">
                {/* linha de progressão*/}
                <div className="progress-line-hist">
                    <div
                        className="progress-fill-hist"
                        style={{ height: `${progress}%` }}
                    />
                </div>

                {eras.map((era, index) => {
                    /* verifica a secção que está ativa no viewport */
                    const isActive = activeEra === index;

                    return (
                        <section
                            key={index}
                            data-index={index}
                            ref={(el) => {
                                if (el) eraRefs.current[index] = el;
                            }}
                            /* adiciona a class is active*/
                            className={`era-hist ${era.side}-hist ${isActive ? "is-active-hist" : ""}`}
                        >
                            <div className="era-card-hist">
                                <p className="era-text-hist">{era.description}</p>

                                <div className="video-wrapper-hist">
                                    {isActive ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${era.videoId}`}
                                            title={era.title}
                                            allowFullScreen
                                        />
                                    ) : (
                                        <img
                                            className="video-thumb-hist"
                                            src={`https://img.youtube.com/vi/${era.videoId}/hqdefault.jpg`}
                                            loading="lazy"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* lado oposto com título e ano*/}
                            <div className="era-side-info-hist">
                                <span className="era-side-year-hist">{era.year || "Época"}</span>
                                <h2 className="era-side-title-hist">{era.title}</h2>
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* botão da seta*/}
            <button
                className={`scroll-top-hist ${showScrollTop ? "visible-hist" : ""}`}
                onClick={scrollToTop}
                aria-label="Voltar ao início"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="12" y1="19" x2="12" y2="5"></line>
                    <polyline points="5 12 12 5 19 12"></polyline>
                </svg>
            </button>
        </main>
    );
}