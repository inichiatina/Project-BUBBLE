const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOGVjMTg3YzgzZDEwNjczOTA0ODI1NzdlOTg0NzVlOCIsIm5iZiI6MTc3ODc3MzQzNS44MzM5OTk5LCJzdWIiOiI2YTA1ZWRiYjVkZDUzNmMzZGUyOTFlMTciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.WeqAL5AOhmq7f3u3cnezHZm2uwskFkbKLWhKpa0IzjM";

const BASE_URL = "https://api.themoviedb.org/3"; // url para ser mais facil e menos repetitivo estar sempre a escreve ro url

const headers = {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
};

// posters dos filmes um if  se existir uma imagem retorna se não retoen null
export const getPosterUrl = (path) =>
    path ? `https://image.tmdb.org/t/p/w500${path}` : null;

// pede filmes populares, em portugês 
export async function getRandomMovies() {
    const page = Math.floor(Math.random() * 10) + 1;
    const res = await fetch(
        `${BASE_URL}/movie/popular?language=pt-PT&page=${page}`,
        { headers }
    );
    const data = await res.json();
    // baralha e devolve 12
    return data.results
        .sort(() => Math.random() - 0.5)
        .slice(0, 12);
}

// query do utilizador pesquisa por palavras
export async function searchMovies(query) {
    const res = await fetch(
        `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=pt-PT`, //encode para filmes que tem caracteres especiais
        { headers }
    );
    const data = await res.json();
    return data.results;
}

//lista de géneros retorna o id e o nome do filme
export async function getGenres() {
    const res = await fetch(
        `${BASE_URL}/genre/movie/list?language=pt-PT`,
        { headers }
    );
    const data = await res.json();
    return data.genres; // [{id, name}]
}

// pesquisa os filmes por id do género
export async function getMoviesByGenre(genreId) {
    const res = await fetch(
        `${BASE_URL}/discover/movie?with_genres=${genreId}&language=pt-PT&sort_by=popularity.desc`,
        { headers }
    );
    const data = await res.json();
    return data.results;
}

//detalhes dos atores que participam no filme mas corta para serem só os 6 primeiros
export async function getMovieDetails(movieId) {
    const [details, credits] = await Promise.all([
        fetch(`${BASE_URL}/movie/${movieId}?language=pt-PT`, { headers }).then(r => r.json()),
        fetch(`${BASE_URL}/movie/${movieId}/credits?language=pt-PT`, { headers }).then(r => r.json()),
    ]);

    return {
        ...details,
        atores: credits.cast?.slice(0, 6) || [],
    };
}