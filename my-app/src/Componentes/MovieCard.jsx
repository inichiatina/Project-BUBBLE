export default function MovieCard({ movie, className }) {  //propriedades do moviecard
    return (
        <div className={`movie-card ${className}`}>

            <img
                src={movie.poster}
            />

            {className === "center" && (
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <p>
                        {movie.genre} - {movie.year}
                    </p>
                </div>
            )}

        </div>
    );
}