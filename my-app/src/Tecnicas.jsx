import React, { useEffect, useRef, useState } from "react";
import "./Tecnicas.css";

export default function Tecnicas() {
    const HOLE_H = 52;

    const holesLeftRef = useRef(null);
    const holesRightRef = useRef(null);

    const [activeIdx, setActiveIdx] = useState(0);
    const [expandedIdx, setExpandedIdx] = useState(null);
    const [videoPlaying, setVideoPlaying] = useState(false);

    const items = [
        {
            roll: "Rolo 001 - Cor",
            number: "▣ 01",
            title: "Cor",
            youtubeId: "t0AOVRnBFDs",
            text: "Ao utilizar cores salientes para destacar partes relevantes em imagens ou animações, ajudamos a guiar a atenção visual para informações importantes e reduzindo a distração com objetos irrelevantes.",
            longText:
                "Color coding, consiste no uso intencional de cores salientes para destacar partes relevantes de uma cena. O objetivo principal é guiar de imediato a atenção visual do espectador para a informação mais importante, reduzindo qualquer distração provocada por objetos irrelevantes ao redor. No cinema, esta técnica funciona como um caminho psicológico que declara o tom moral da narrativa antes mesmo de haver qualquer diálogo. O exemplo mais reconhecível desta técnica está na saga Star Wars. O universo visual divide de forma clara o bem e o mal através de paletas de cores contrastantes para evitar ambiguidades. O Império e os Sith são sistematicamente associados ao preto e ao vermelho, cores bastante associadas a sensações de perigo, agressão e regimes totalitários. Os vilões atacam escondidos sob vestes escuras e empunham sabres de luz vermelha saturada, criando um ponto de saliência visual impossível de ignorar. Em contrapartida, os heróis da Aliança Rebelde e da Ordem Jedi vestem tons terra mais suaves e utilizam sabres de luz azuis ou verdes. Estas cores estão fortemente associadas à natureza, calma e paz. Ao aplicar este código cromático estrito, o realizador manipula o foco e os sentimentos do público em tempo real. O espetador sabe instantaneamente quem deve apoiar e quem deve temer, bloqueando o pensamento crítico através da resposta emotional imediata que as cores geram."
        },
        {
            roll: "Rolo 002 - Câmara",
            number: "▣ 02",
            title: "Enquadramento de Câmara",
            youtubeId: "eoTIR99FZAA",
            text: "A forma como enquadramos uma cena define o que o espectador prioriza. O posicionamento da câmara revela intenção, hierarquia e emoção antes de qualquer palavra ser dita.",
            longText:
                "O enquadramento de câmera refere-se à posição vertical do eixo da lente em relação aos olhos do sujeito filmado. Esta decisão técnica não é apenas estética; ela estabelece a relação de poder imediata entre a audiência e os personagens. Dependendo da altura em que a câmera é colocada, o espetador é forçado a assumir uma postura psicológica de submissão, superioridade ou igualdade democrática. O ângulo baixo (low angle) coloca a câmera abaixo do nível dos olhos, apontada para cima. Esta técnica faz o sujeito parecer imponente, poderoso e heróico. Na distopia Mad Max: Estrada da Fúria, o ditador Immortan Joe é filmado constantemente deste ângulo quando discursa na varanda da cidadela. Ao surgir contra o céu limpo, isolado e agigantado, ele é transformado num deus literal para o público. O ângulo baixo força o espectador a adotar a perspetiva submissa da multidão oprimida que está cá em baixo na terra."
        },
        {
            roll: "Rolo 003 - Luz",
            number: "▣ 03",
            title: "Luz",
            youtubeId: "g79eDQk6BC0",
            text: "A iluminação molda volumes, cria atmosfera e guia o olhar de forma subtil. Sombras e contraluz são tão expressivos quanto qualquer diálogo — falam diretamente às emoções.",
            longText:
                "A técnica de sinalização por holofotes, ou spotlights, é uma das formas mais agressivas e eficazes de guiar a atenção visual. Consiste em escurecer quase por completo a imagem, deixando apenas uma área específica ou o sujeito relevante iluminado. Ao apagar o ambiente em redor, o realizador elimina qualquer ruído visual ou contexto espacial que possa gerar distração, forçando o cérebro do espetador a focar-se a cem por cento na mensagem central da cena. No cinema moderno, o filme La La Land: Melodia de Amor aplica esta teoria de teatro de forma óbvia e consciente. Em várias sequências, quando os protagonistas Mia ou Sebastian começam a cantar ou a tocar piano, o cenário realista ao redor deles desvanece instantaneamente até ficar num preto absoluto. Um único círculo de luz cirúrgica foca-se nos atores, isolando-os do resto do mundo, das pessoas no café e das paredes da sala. Este uso do spotlight serve para simular a própria mente das personagens, onde o mundo exterior deixa de existir. Visualmente, a técnica funciona como um funil percetivo. Ao remover os objetos irrelevantes do fundo, o realizador neutraliza a postura crítica e analítica da audiência. O público é arrastado para dentro da vulnerabilidade e da mensagem lírica daquele personagem específico naquele segundo, provando a eficácia da luz no controlo da atenção."
        },
        {
            roll: "Rolo 004 - Distância da Câmera",
            number: "▣ 04",
            title: "Distância da Câmara",
            youtubeId: "yELH2Tdk93Y",
            text: "Um travelling lento pode ampliar a tensão; um zoom abrupto cria surpresa. O movimento da câmara é ritmo — a pulsação invisível que define o tom de cada plano.",
            longText:
                "A distância da câmera refere-se à proximidade física aparente da lente em relação à cena. A escala do plano escolhido pelo realizador funciona como um termómetro para o envolvimento emocional da audiência. Planos muito próximos são usados para humanizar e gerar empatia profunda, enquanto distâncias maiores servem para desvalorizar a entidade individual, transformando pessoas em números ou padrões geométricos. Os primeiros planos, ou close-ups, fecham o enquadramento no rosto do sujeito para capturar micro expressões e emoções puras. Na icónica cena de Interstellar, em que o astronauta Cooper regressa de uma missão e assiste a décadas de vídeos gravados pelos filhos, a câmera cola-se ao seu rosto. O ecrã é inundado pelas suas lágrimas e tremores faciais. Ao eliminar completamente o resto da nave e o ruído de fundo, o realizador manipula o foco de forma absoluta: o universo desaparece e resta apenas a dor crua da paternidade fraturada."
        },
        {
            roll: "Rolo 005 - Som",
            number: "▣ 05",
            title: "Som & Silêncio",
            youtubeId: "8r2ODRi8xyQ",
            text: "O som preenche o que a imagem não pode mostrar. O silêncio, quando usado com intenção, é tão poderoso quanto o ruído — convida o espectador a sentir o peso do que não é dito.",
            longText:
                "A música é reconhecida como a ferramenta mais eficaz para contornar o filtro racional do cérebro. Por ser processada em áreas cerebrais ligadas à emoção antes de chegar ao córtex analítico, ela manipula diretamente as nossas respostas fisiológicas, como o batimento cardíaco e a adrenalina. Na propaganda e no cinema de massas, o som dita como uma imagem ambígua deve ser interpretada, rotulando de imediato quem é o herói e quem é o vilão. No filme Capitão América: O Soldado do Inverno, a Marvel utiliza o som de forma cirúrgica para transmitir a sua mensagem. Sempre que o herói está em cena, a banda sonora apoia-se em marchas militares clássicas que transmitem nobreza e segurança. Contudo, no segundo exato em que o Soldado do Inverno aparece, a melodia cessa abruptamente e é substituída por um grito industrial metálico distorcido. Este som dissonante assemelha-se a uma máquina a chiar em agonia, provocando um desconforto biológico instantâneo no espectador. O público não precisa de ver o vilão a cometer uma atrocidade para o rejeitar; o som ativa um estado de alerta e medo no sistema nervoso antes mesmo de qualquer diálogo acontecer. A música reforça a mensagem do bloco ideológico e dita a reação emocional com precisão milimétrica."
        },
        {
            roll: "Rolo 006 - Narração",
            number: "▣ 06",
            title: "Narração",
            youtubeId: "sTEptL7XmBg",
            text: "A narração diz respeito a quem transmite a mensagem verbal de um vídeo.",
            longText:
                "A narração diz respeito a quem transmite a mensagem verbal de um vídeo. Quando se utiliza um narrador em off — ou seja, uma voz cujo corpo está fora do ecrã —, o estatuto dessa mensagem muda radicalmente. Os narradores invisíveis são geralmente percebidos pela audiência como omniscientes, neutros e detentores de uma verdade absoluta. Por não terem falhas físicas ou preconceitos visíveis, tornam-se muito mais credíveis do que um protagonista envolvido na ação. No clássico Os Condenados de Shawshank, a narração em off é a alma da obra. A história da prisão e do sofrimento de Andy não é contada por ele próprio, mas sim pelo seu amigo Red, interpretado pela voz profunda e calma de Morgan Freeman. Ao colocar a narrativa numa voz experiente, pausada e reflexiva, o realizador acalma a ansiedade do espectador. O ambiente brutal da prisão é transformado numa fábula humanista, guiando o público com uma autoridade moral inabalável que dita exatamente como devemos interpretar os factos. No entanto, esta autoridade automática da 'Voz de Deus' também pode ser usada como uma armadilha perceptiva, como acontece em Clube da Luta. O filme é inteiramente narrado em off pelo protagonista, e o espectador aceita as suas explicações como factos absolutos. Mais tarde, revela-se que o narrador é psicologicamente não-confiável e sofre de alucinações. O realizador David Fincher usou a credibilidade inquestionável da voz em off para enganar deliberadamente o público, provando o perigo de aceitar mensagens sem espírito crítico."
        },
        {
            roll: "Rolo 007 - Sinais de Cor",
            number: "▣ 07",
            title: "Sinais de Cor",
            youtubeId: "A6zegTaEgRE",
            text: "Além da codificação simples, temos a técnica dos sinais de cores em movimento.",
            longText:
                "Além da codificação simples, temos a técnica dos sinais de cores em movimento, ou spreading color cues, que utiliza cores que progridem através de uma sequência cronológica e geométrica. Esta estratégia serve para mostrar a dinâmica, o fluxo ou o funcionamento de um sistema altamente complexo e invisível. Estudos mostram que esta técnica é muito superior ao uso de setas externas, pois guia a atenção natural do olho para componentes que teriam uma baixa saliência perceptiva no plano geral. No filme sul-coreano Parasitas, o realizador Bong Joon-ho usa esta progressão cromática para ilustrar o implacável sistema de classes. Durante a sequência da tempestade, a água escura, suja e contaminada começa a escorrer e a inundar as ruas de Seul, progredindo fisicamente das zonas ricas no topo da colina até aos apartamentos subterrâneos das classes mais pobres. A progressão deste fluxo cinzento e castanho funciona como um guia visual dinâmico que conecta a geografia da cidade e demonstra visualmente a relação de causa e efeito da desigualdade social. Noutro extremo, o filme de animação Spider-Man: Across the Spider-Verse eleva esta técnica digital ao nível pedagógico máximo para explicar conceitos abstratos como o multiverso. Quando ocorre a quebra de uma linha temporal, o colapso daquela realidade é sinalizado por uma mancha geométrica de cor roxa e preta, com textura de falha digital ou glitch, que se espalha e progride sequencialmente pelas paredes, edifícios e corpos. "
        }
    ];

    //função que cria os quadrados das fitas - calcula a altura total da página e divide os quadrados pela página para criar o efeito de fita de cinema
    useEffect(() => {
        const buildHoles = (el) => {
            if (!el) return;

            const count =
                Math.ceil(document.body.scrollHeight / HOLE_H) + 10;

            for (let i = 0; i < count; i++) {
                const u = document.createElement("div");
                u.className = "hole-unit";

                const h = document.createElement("div");
                h.className = "hole";

                u.appendChild(h);
                el.appendChild(u);
            }
        };

        buildHoles(holesLeftRef.current);
        buildHoles(holesRightRef.current);

        //calcula a divisão pelo tamamnho dos quadrados que fazem de furos e cria uma class css dinamica
        const onScroll = () => {
            const sy = window.scrollY;
            const shift = -(sy % HOLE_H);

            document.querySelectorAll(".sprocket-holes").forEach((el) => {
                el.style.setProperty("--scroll-shift", `${shift}px`);
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    //garante que se o utilziador fizer scroll o video para e volta a exibir a thumbnail
    useEffect(() => {
        const filmItems = document.querySelectorAll(".film-item");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        setActiveIdx(Number(entry.target.dataset.index));
                        setVideoPlaying(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        filmItems.forEach((item) => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    //ao fazer scroll localiza o cartão seguinte e faz um deslize suave
    const scrollToItem = (index) => {
        document
            .querySelector(`.film-item[data-index="${index}"]`)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    //quando o painel de lado está aberto bloqueia o scroll para evitar que a página de fundo se mexa
    useEffect(() => {
        if (expandedIdx !== null) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [expandedIdx]);

    // navegação através de teclas
    useEffect(() => {
        const onKeyDown = (e) => {
            if (expandedIdx === null) return;

            if (e.key === "Escape") {
                setExpandedIdx(null);
                return;
            }

            const changeIndex = (newIndex) => {
                setExpandedIdx(newIndex);

                const el = document.querySelector(
                    `.film-item[data-index="${newIndex}"]`
                );

                el?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
            };

            if (e.key === "ArrowRight") {
                setExpandedIdx((prev) => {
                    if (prev === null) return prev;
                    const next = Math.min(prev + 1, items.length - 1);

                    if (next !== prev) changeIndex(next);
                    return next;
                });
            }

            if (e.key === "ArrowLeft") {
                setExpandedIdx((prev) => {
                    if (prev === null) return prev;
                    const next = Math.max(prev - 1, 0);

                    if (next !== prev) changeIndex(next);
                    return next;
                });
            }

            if (e.key === "ArrowDown") {
                setExpandedIdx((prev) => {
                    if (prev === null) return prev;
                    const next = Math.min(prev + 1, items.length - 1);

                    if (next !== prev) changeIndex(next);
                    return next;
                });
            }

            if (e.key === "ArrowUp") {
                setExpandedIdx((prev) => {
                    if (prev === null) return prev;
                    const next = Math.max(prev - 1, 0);

                    if (next !== prev) changeIndex(next);
                    return next;
                });
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [expandedIdx, items.length]);

    return (
        <>
            <header>
                <div className="h-divider"></div>

                <span className="counter">
                    {String(activeIdx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </span>
            </header>

            <nav className={`progress-rail ${expandedIdx !== null ? "shift" : ""}`}>
                {items.map((_, index) => (
                    <div
                        key={index}
                        className={`pip ${activeIdx === index ? "active" : ""}`}
                        onClick={() => scrollToItem(index)}
                    />
                ))}
            </nav>

            <div className={`page ${expandedIdx !== null ? "expanded" : ""}`}>
                <div className={`film-strip ${expandedIdx !== null ? "shift" : ""}`}>
                    <div className="sprocket-holes left" ref={holesLeftRef} />
                    <div className="sprocket-holes right" ref={holesRightRef} />

                    {items.map((item, index) => (
                        <div key={index} className={`film-item ${activeIdx === index ? "active" : ""}`} data-index={index}>
                            <div className="frame-wrapper">
                                <div className="frame">
                                    <div className="scratch"></div>
                                    <div className="scratch"></div>

                                    {/* Só renderiza o iframe se o item estiver ativo E o utilizador tiver clicado no botão de play */}
                                    {activeIdx === index && videoPlaying ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                                            title={item.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div
                                            className="video-placeholder"
                                            onClick={() => {
                                                if (activeIdx === index) {
                                                    setVideoPlaying(true);
                                                } else {
                                                    scrollToItem(index);
                                                }
                                            }}
                                            style={{
                                                backgroundImage: `url(https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg)`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                width: '100%',
                                                height: '100%',
                                                position: 'relative',
                                                cursor: 'pointer' // Mostra que a capa é clicável
                                            }}
                                        >
                                            <div className="play-btn" style={{ position: 'absolute' }}>
                                                <svg width="18" height="18" viewBox="0 0 18 18">
                                                    <polygon points="5,3 15,9 5,15" fill="#C8A84B" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    <div className="frame-label">{item.roll}</div>
                                    <div className="frame-number">{item.number}</div>
                                </div>
                            </div>

                            <div className="text-panel">
                                <div className="eyebrow">Técnica Cinematográfica</div>
                                <h2>{item.title}</h2>
                                <p>{item.text}</p>

                                <button className="read-more" onClick={() => setExpandedIdx(index)}>
                                    Ler mais
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {expandedIdx !== null && (
                    <div className="detail-panel show">
                        <button className="close-detail" onClick={() => setExpandedIdx(null)}>
                            ×
                        </button>

                        <div className="detail-content">
                            <div className="eyebrow">Técnica Cinematográfica</div>
                            <h2>{items[expandedIdx].title}</h2>
                            <p>{items[expandedIdx].longText}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}