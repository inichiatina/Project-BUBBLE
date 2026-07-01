import { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger); //avisa o plugin gsap que o scroll vai ser inicializado

export default function Entrada() {
    const canvasRef = useRef(null);  //referencia para o canvas que vai ser elemento de desenho
    const containerRef = useRef(null);  //referencia para a secção que ocntrola o tamanho do scroll
    const navigate = useNavigate();

    const [showIntro, setShowIntro] = useState(true);  //controla o logo inicial

    const logoRef = useRef(null);
    const hintRef = useRef(null);
    const introRef = useRef(null);

    useLayoutEffect(() => {
        const tl = gsap.timeline(); //cria uma timeline para que as animações aocnteçam em sequencia

        tl.fromTo(                  //com o métodos do gsap fromTo o logo cresce suavemente 
            logoRef.current,
            {
                opacity: 0,
                scale: 0.8
            },
            {
                opacity: 1,
                scale: 1,
                duration: 2         //durante 2 segundos
            }
        );

        tl.to(                     //outro método do gsap que faz o logo parecer um yoyo
            logoRef.current,
            {
                scale: 1.08,
                repeat: 3,
                yoyo: true,
                duration: 1,
                ease: "power1.inOut"
            }
        );

        tl.to(                          // o logo desaparece
            logoRef.current,
            {
                opacity: 0,
                duration: 1
            }
        );

        tl.to({}, { duration: 0.5 });  //cria uma pausa de 0.5

        tl.fromTo(                     // faz com que a frase a pareça e suba levemente 
            hintRef.current,
            {
                opacity: 0,
                y: 20
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8
            }
        );

        // animação da seta - pega no fisrt child e cria uma animação continua
        gsap.to(hintRef.current?.firstChild, {
            y: 15,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "power1.inOut"
        });

        // primeiro scroll fecha a intro
        const handleFirstScroll = () => {
            gsap.to(hintRef.current, {
                opacity: 0,
                duration: 0.5
            });

            gsap.to(introRef.current, {
                opacity: 0,
                duration: 0.8,
                delay: 0.2,
                onComplete: () => {
                    setShowIntro(false);  //muda o estado do logo para falso 
                }
            });

            window.removeEventListener("wheel", handleFirstScroll);    // para não repetir a animação sempre que o utilziador voltar
        };

        window.addEventListener("wheel", handleFirstScroll);

        //organização dos frames para o scroll
        const startFrame = 100;
        const endFrame = 305;
        const frameCount = endFrame - startFrame + 1;

        const currentFrame = (index) =>
            `/frames_entarda/${String(index + startFrame).padStart(4, "0")}.webp`;  //transforma o número de 100 para 0100

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");  //ativa o desenho em 2d

        const playhead = { frame: 0 };
        const images = [];

        function resize() {                    //redimensiona o canvas paraa estra na altura e largura do ecra
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        window.addEventListener("resize", resize);
        resize();

        function render() { // no caso do utilizador fizer scroll muito depressa a função ajuda o gsap a orientar-se nos frames que se seguem na animação
            const frame = Math.min(
                frameCount - 1,
                Math.max(0, Math.floor(playhead.frame))
            );

            const img = images[frame];

            // checka se a imagem já foi totalemnte descarregada pelo navegador
            if (!img) {
                return;
            }

            if (!img.complete) {
                return;
            }

            //apaga a imagem anterior para a imagem a seguir poder aparecer
            context.clearRect(0, 0, canvas.width, canvas.height);

            //ajuda o inicio de desenho da imagem
            context.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );
        }

        // contador para ver quantas imagens já foram descarregadas pelo navegador
        let loaded = 0;

        // contador
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);

            //começa quando a imagem está descarregada completamente
            img.onload = () => {
                loaded++;
                if (loaded === 1) render();  //assim que a primeira estiver carregada é logo desenhada no canvas
            };

            img.onerror = () => { };

            //guarda a imagem na lista de images
            images.push(img);
        }

        //evita que o react tente mudar de  página
        let hasNavigated = false;

        const tween = gsap.to(playhead, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: render,

            // conecta a animação ao scroll
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,

                // função para verificar se o utilizador já passou pela animação
                onUpdate: (self) => {
                    if (self.progress > 0.995 && !hasNavigated) {
                        hasNavigated = true;

                        //guarda na storage de sessão que o utilizador já viu a animação 
                        sessionStorage.setItem("introSeen", "true");
                        navigate("/home");
                    }
                }
            }
        });

        //destroi tudo o que a animação contruiu para que não passe para as outras páginas
        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("wheel", handleFirstScroll);
            window.removeEventListener("touchmove", handleFirstScroll);

            tween.kill();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, [navigate]);

    return (
        <section
            ref={containerRef}
            style={{
                height: "300vh",
                position: "relative"
            }}
        >
            {showIntro && (
                <div
                    ref={introRef}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "##0A0A0A",
                        zIndex: 9999,
                        overflow: "hidden"
                    }}
                >
                    {/* logo */}
                    <div
                        style={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <img
                            ref={logoRef}
                            src="/imgs/logo principal.png"
                            style={{
                                width: "260px",
                                opacity: 0
                            }}
                        />
                    </div>

                    {/* frase */}
                    <div
                        ref={hintRef}
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            color: "#F0F2EE",
                            textAlign: "center",
                            opacity: 0
                        }}
                    >
                        <div
                            style={{
                                fontSize: "3rem",
                                marginBottom: "20px"
                            }}
                        >
                            ↓
                        </div>

                        <div
                            style={{
                                fontSize: "1.2rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase"
                            }}
                        >
                            Faz scroll para explorar
                        </div>
                    </div>
                </div>
            )}

            <canvas
                ref={canvasRef}
                style={{
                    position: "sticky",
                    top: 0,
                    width: "100vw",
                    height: "100vh",
                    display: showIntro ? "none" : "block"
                }}
            />
        </section>
    );
}