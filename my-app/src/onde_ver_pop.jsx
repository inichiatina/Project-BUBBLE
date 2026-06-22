import { useEffect, useState } from "react";
import "./onde_ver_pop.css";

export default function OndeVer({ title }) {
    const API_KEY = "5ArNs3BWvdLjtDZcJZN2Yf7ofD6GiGNAMNf4c2KB";

    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(false);

    //verificação de segurança caso o componente for chamado e não tiver o titulo do filme
    useEffect(() => {
        if (!title) {
            setProviders([]);
            return;
        }

        // procura o id do filme e procura plataformas para ve lo e depois filtra os resultados para os 3 primeiros
        async function fetchProviders() {
            try {
                setLoading(true);

                const searchRes = await fetch(
                    `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${encodeURIComponent(title)}`
                );

                const searchData = await searchRes.json();
                const movie = searchData.title_results?.[0];

                if (!movie) {
                    setProviders([]);
                    return;
                }

                const sourceRes = await fetch(
                    `https://api.watchmode.com/v1/title/${movie.id}/sources/?apiKey=${API_KEY}`
                );

                const sourceData = await sourceRes.json();

                const topProviders = Array.from(
                    new Map(
                        sourceData
                            .filter(item => item.type === "sub")
                            .map(item => [item.source_id, item])
                    ).values()
                ).slice(0, 3);

                setProviders(topProviders);

            // se alguma coisa correr mal no processo define como vazio para não breaker o website
            } catch (err) {
                setProviders([]);
            } finally {
                setLoading(false);
            }
        }

        fetchProviders();
    }, [title]);

    //recebe o link da plataforma e devolve o dominio principal (https.netflix fixa so netflix.com)
    function getDomain(url) {
        try {
            return new URL(url).hostname.replace("www.", "");
        } catch {
            return null;
        }
    }

    const hasProviders = providers.length > 0;
    if (!title) return null;

    return (
        <div className="providers-wrapper">
            <h3>Onde ver</h3>

            {loading && <p>Loading...</p>}

            {!loading && !hasProviders && (
                <div className="no-providers">
                    Houston, we have a problem! Não foram encontrados resultados.
                </div>
            )}

            {!loading && hasProviders && (
                <div className="providers-grid">
                    {providers.map((p) => {
                        let domain = null;

                        if (p.web_url) {
                            domain = getDomain(p.web_url);
                        }

                        let logo = null;

                        if (domain) {
                            logo = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;
                        }

                        let content;

                        if (logo) {
                            content = <img src={logo}/>;
                        } else {
                            content = (
                                <div className="fallback">
                                    {p.name}
                                </div>
                            );
                        }

                        return (
                            <div
                                className="provider-card"
                                key={`${p.source_id}-${p.type}`}
                            >
                                {content}
                                <span>{p.name}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}