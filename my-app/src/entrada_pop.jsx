import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AnimaPop({ frameCount = 242, folderPath = "/frames_entrada_pop" }) {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const images = [];
        const playhead = { frame: 0 };

        // redimensiona o canvas para ocupar o ecrã inteiro
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render(); //redesenha o frame atual após o resize
        }

        const render = () => {
            const frame = Math.floor(playhead.frame);
            const img = images[frame];
            if (img && img.complete) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                //faz com que a imagem seja tipo backgroung:cover
                const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            }
        };

        //carrregamento das imagens
        let loadedCount = 0;
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            // garante a formatação das imagens direitas 0000, 0001
            img.src = `${folderPath}/${String(i).padStart(4, "0")}.webp`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === 1) render(); //renderiza o primeiro frame 
            };
            images.push(img);
        }

        window.addEventListener("resize", resize);
        resize();

        //cria o gatilho scroll do gsap
        const tl = gsap.to(playhead, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=200%",
                scrub: 0.5,
                pin: true, //bloqueia a página enquanto os frames passam
            }
        });

        //limpa quando o componente sai do ecrã
        return () => {
            tl.kill();
            window.removeEventListener("resize", resize);
        };
    }, [frameCount, folderPath]);

    return (
        <div ref={containerRef} className="scroll-container" style={{ height: "100vh" }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: -1
                }}
            />
        </div>
    );
}