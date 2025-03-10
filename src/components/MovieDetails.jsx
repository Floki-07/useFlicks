import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Stars from "./Stars";

const MovieDetails = ({ movieId, addMovie, watched, onDelete }) => {

    const [movie, setMovie] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [moviePresent, setMoviePresent] = useState(false);
    const [userRating, setUserRating] = useState(0);
    const [watchedUserRating, setWatchedUserRating] = useState(0);
    const handleadd = () => {
        if (movie) {
            movie.userRating = userRating;
            addMovie(movie);
        }
    };

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`https://cors-anywhere.herokuapp.com/http://www.omdbapi.com/?apikey=ce260100&i=${movieId}`);
                const data = await res.json();
                setMovie(data);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    useEffect(() => {
        if (movie) {
            document.title = `Movie | ${movie.Title}`;
        }
    }, [movie?.Title]);

    useEffect(() => {
        // Check if the movie is present in the watched list
        const isMoviePresent = watched.some((watchedMovie) => watchedMovie.imdbID === movieId);
        setMoviePresent(isMoviePresent);

        if (isMoviePresent) {
            const foundMovie = watched.find((watchedMovie) => watchedMovie.imdbID === movieId);
            setWatchedUserRating(foundMovie.userRating || 0);
            setUserRating(foundMovie.userRating || 0);
        } else {
            setWatchedUserRating(0);
            setUserRating(0);
        }
    }, [watched, movieId]);

    if (isLoading) {
        return <div className="loader">Loading...</div>;
    }

    if (!movie) {
        return <div>No movie found.</div>;
    }


    return (
        isLoading ? (
            <div className="loader">Loading...</div>
        ) : (
            <div className="details">
                <header>
                    <img src={movie.Poster} alt={movie.Title} />
                    <div className="details-overview">
                        <h2>{movie.Title}</h2>
                        <p>{movie.Released} • {movie.Runtime}</p>
                        <p>{movie.Genre}</p>
                        <p>
                            <span>⭐</span>
                            {movie.imdbRating}
                        </p>
                    </div>
                </header>

                <section>
                    <div className="rating">

                        {moviePresent ?
                            <>
                                <span>Your rated the movie {watchedUserRating} ⭐</span>
                                {/* <button className="btn-add" onClick={onDelete}>Remove from list</button> */}
                            </>
                            : <>
                                <Stars userRating={userRating} setUserRating={setUserRating} />
                                <button className="btn-add" onClick={handleadd}>Add to list</button>
                            </>
                        }

                    </div>
                    <span><em>{movie.Plot}</em></span>
                    <p>Starring: {movie.Actors}</p>
                    <p>Directed by: {movie.Director}</p>
                </section>

            </div>
        )
    );

}

export default MovieDetails