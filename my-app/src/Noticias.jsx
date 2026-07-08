import { useEffect, useState } from "react";
import "./Noticias.css";

export default function NewsPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredCard, setHoveredCard] = useState(null);

    const API_KEY = '4cd97caeb3b144f08a10d9147aa012c7';
    const articlesPerPage = 12;

    //faz um único pedido à pi e depois monta a página consoante o que for devolvido
    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        setLoading(true);

        try {
            //palavras obrigatórias na pesquisa
            const positiveQuery = "(cinema OR filme OR filmes OR realizador OR OSCARS OR \"Globos de Ouro\" OR \"sétima arte\" OR \"estreia de cinema\" OR \"festival de cinema\")";

            // palavras proibidas na pesquisa
            const negativeQuery = "NOT (política OR governo OR eleições OR futebol OR ronaldo OR \"reality show\" OR influencer)";

            const query = `${positiveQuery} ${negativeQuery}`;

            // sites de noticias portugueses
            const ptDomains = [
                "sapo.pt", "publico.pt", "rtp.pt", "sicnoticias.pt",
                "tvi.iol.pt", "jn.pt", "dn.pt", "noticiasaominuto.com",
                "observador.pt", "cinevisao.pt", "c7nema.net", "mag.sapo.pt"
            ].join(",");

            const url = `/api/noticias?q=${encodeURIComponent(
                query
            )}&domains=${ptDomains}&language=pt&sortBy=publishedAt&pageSize=100&apiKey=${API_KEY}`;

            const response = await fetch(url);
            const data = await response.json();

            //palavras proibidas no frontend
            const bannedWords = [
                //politica
                "política", "governo", "ministro", "deputado", "partido", "eleições",
                "parlamento", "assembleia da república", "sindicato", "greve", "autárquicas",
                //desporto/futebol
                "futebol", "ronaldo", "benfica", "sporting", "porto", "golo", "liga", "treinador",
                //famosos/redes sociais
                "influencer", "instagram", "tiktok", "reality show", "big brother",
                "casa dos segredos", "novela", "bebé", "grávida", "divórcio", "namorado"
            ];

            const rawArticles = data.articles || [];

            //filtrar os artigos com palavras proibidas
            const filteredArticles = rawArticles.filter((article) => {
                const title = (article.title || "").toLowerCase();
                const description = (article.description || "").toLowerCase();

                //se alguma palavra proibida estiver no artigo é descartada
                const hasBannedWord = bannedWords.some(
                    (word) => title.includes(word) || description.includes(word)
                );

                return !hasBannedWord;
            });

            setArticles(filteredArticles);
        } catch (error) { } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">A carregar notícias do cinema...</div>;
    }

    //paginação da página
    const indexOfLast = currentPage * articlesPerPage;
    const indexOfFirst = indexOfLast - articlesPerPage;
    const currentArticles = articles.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(articles.length / articlesPerPage);

    return (
        <div className="container">
            <h1>NOTÍCIAS</h1>

            <div className="news-grid">
                {currentArticles.length === 0 ? (
                    <p className="no-news">Nenhuma notícia de cinema encontrada de momento.</p>
                ) : (
                    currentArticles.map((article, index) => (
                        <div
                            key={index}
                            className={`news-card ${hoveredCard === index ? "expanded" : ""
                                }`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() =>
                                window.open(
                                    article.url,
                                    "_blank",
                                    "noopener,noreferrer"
                                )
                            }
                        >
                            <img
                                src={
                                    article.urlToImage ||
                                    "https://via.placeholder.com/500x300?text=No+Image"
                                }
                            />

                            <div className="card-content">
                                <h3>{article.title}</h3>

                                {hoveredCard === index && (
                                    <div className="preview-content">
                                        <p>
                                            {article.description ||
                                                "Sem descrição disponível"}
                                        </p>

                                        <div className="meta">
                                            <span>{article.source?.name}</span>

                                            <span>
                                                {new Date(
                                                    article.publishedAt
                                                ).toLocaleDateString("pt-PT")}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() =>
                            setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                    >
                        ◀
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            className={currentPage === i + 1 ? "active" : ""}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() =>
                            setCurrentPage((p) =>
                                Math.min(p + 1, totalPages)
                            )
                        }
                        disabled={currentPage === totalPages}
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
}