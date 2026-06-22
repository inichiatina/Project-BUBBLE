import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import fita from "/svgs_bolhas_menu/rolo_de_fita_svg.svg";
import fita_vermelha from "/svgs_bolhas_menu/fita_vermelho.svg";
import historia from "/svgs_bolhas_menu/HISTORIA DO CINEMA.svg";
import prop from "/svgs_bolhas_menu/SABER MAIS.svg";
import noticias from "/svgs_bolhas_menu/NOTICIAS.svg";
import perfil from "/svgs_bolhas_menu/PERFIL.svg";
import pop from "/svgs_bolhas_menu/POP THE BUBBLE.svg";
import tecnicas from "/svgs_bolhas_menu/TECNICAS_PROP.svg";


export default function MenuG() {
    const navigate = useNavigate();
    const [active, setActive] = useState(null);

    const items = [
        { img: tecnicas, path: "/tecnicas", label: "TÉCNICAS DE PROPAGANDA", offsetX: -18, offsetY: -34, scale: 2.4 },
        { img: prop, path: "/prop", label: "DESCOBRE MAIS", offsetX: 1, offsetY: -28, scale: 2.4 },
        { img: perfil, path: "/login", label: "PERFIL", offsetX: -31, offsetY: -7, scale: 2.4 },
        { img: noticias, path: "/noticias", label: "NOTICIAS", offsetX: -55, offsetY: 0, scale: 2.4 },
        { img: pop, path: "/pop", label: "POP THE BUBBLE", offsetX: -45, offsetY: -40, scale: 2.4 },
        { img: historia, path: "/historia", label: "HISTÓRIA DO CINEMA", offsetX: -55, offsetY: -50, scale: 2.4 },

    ];

    const current = items[active];

    const centerX = 250;
    const centerY = 250;

    const radiusCircle = 145;
    const radius = 60;
    const rotationOffset = 30;
    const offsetY = 4;

    // posições base usadas pela imagem)
    const holes = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 - 90 + rotationOffset) * (Math.PI / 180);
        return {
            cx: centerX + radiusCircle * Math.cos(angle),
            cy: centerY + radiusCircle * Math.sin(angle),
        };
    });

    useEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // ajustar os hotspots
    const hoverOffsetX = 4;

    const hoverOffsetY = -3;

    const hoverHoles = holes.map(h => ({
        cx: h.cx + hoverOffsetX,
        cy: h.cy + hoverOffsetY,
    }));

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "80vh",
            }}
        >
            <div style={{ position: "relative", width: 500 }}>
                <img src={fita} alt="rolo" style={{ width: "100%", position: "absolute", zIndex: 2, }} />
                <img src={fita_vermelha} style={{ width: "100%", position: "relative", zIndex: 0, }} />

                {/* hotspots */}
                <svg
                    viewBox="0 0 500 500"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 3,
                    }}
                >
                    {hoverHoles.map((h, i) => (
                        <circle
                            key={i}
                            cx={h.cx}
                            cy={h.cy}
                            r={radius}
                            fill="rgba(0,0,0,0)" /* cor dos hotspots para checkar se estão no sitio certo */
                            onMouseEnter={() => setActive(i)}
                            onMouseLeave={() => setActive(null)}
                            onClick={() => navigate(items[i].path)}
                            style={{ cursor: "pointer" }}
                        />
                    ))}
                </svg>

                {/*bolha*/}
                {active !== null && (
                    <div
                        style={{
                            position: "absolute",
                            top: holes[active].cy - radius - offsetY,
                            left: holes[active].cx - radius,
                            width: radius * 2,
                            height: radius * 2,
                            borderRadius: "50%",
                            overflow: "visible",
                            pointerEvents: "none",
                            zIndex: 1,
                        }}
                    >

                        <img
                            src={current.img}
                            style={{
                                width: `${current.scale * 100}%`,
                                height: `${current.scale * 100}%`,
                                objectFit: "cover",
                                transform: `translate(${current.offsetX}%, ${current.offsetY}%)`,
                            }}
                        />
                    </div>


                )}

                {active !== null && (
                    <div
                        style={{
                            position: "absolute",
                            top: -100,
                            left: "50%",
                            transform: "translateX(-50%)",
                            fontFamily: "DIN Condensed",
                            color: "#F0F2EE",   
                            padding: "8px 16px",
                            borderRadius: 10,
                            fontSize: 26,
                            whiteSpace: "nowrap",

                            zIndex: 10,
                        }}
                    >
                        {current.label}
                    </div>
                )}

            </div>

        </div>
    );
}