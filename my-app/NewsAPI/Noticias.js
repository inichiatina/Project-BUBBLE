export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { q, domains, language, sortBy, pageSize, apiKey } = req.query;

    const newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&domains=${domains}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}&apiKey=${apiKey}`;

    try {
        const response = await fetch(newsUrl);
        const data = await response.json();
        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao carregar notícias' });
    }
}