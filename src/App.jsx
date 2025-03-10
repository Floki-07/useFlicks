import { useEffect } from "react";
import { useState } from "react";
import MovieDetails from "./components/MovieDetails";


const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


export default function App() {

  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('')
  const [error, seterror] = useState('')
  const [isLoading, setisLoading] = useState(false)
  const [selectedmovieId, setselectedmovieId] = useState()
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    let items = JSON.parse(localStorage.getItem('watchedMovies'))
    if (items) {
      setWatched(items)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('watchedMovies', JSON.stringify(watched));
  }, [watched]);

  const handleMovieSelection = (id) => {
    setselectedmovieId((previd) => previd === id ? null : id)
  }


  function addnewmovie(movie) {
    setWatched((watched) => [...watched, movie])
  }

  const handleDelete = (id) => {
    let updatedMovies = watched.filter((movie) => movie.imdbID != id)
    setWatched(updatedMovies);
  }

  const handleBack = () => {
    setselectedmovieId(null)
    document.title = `useFlicks`;
  }


  useEffect(() => {
    if (query.length < 3) {
      setMovies([]);
      seterror("");
      return;
    }
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {

      try {
        setisLoading(true);
        seterror('');
        let url=import.meta.env.VITE_URL;
        console.log((url));
        
        let res = await fetch(`${import.meta.env.VITE_URL}&s=${query}`, { signal });
        if (!res.ok) {
          throw new Error(`Error occurred while fetching`);
        }

        let data = await res.json();
        if (data.Search) {
          setMovies(data.Search);
        } else {
          throw new Error('No movies found');
        }
        setisLoading(false);

      } catch (error) {
        if (error.name !== 'AbortError')
          seterror(error.message)

      } finally {
        setisLoading(false);
      }

    }
    handleBack()
    fetchData()
    return function () {
      controller.abort();
    }
  }, [query]);





  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Escape' && selectedmovieId) {
        handleBack();
      }
    };



    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedmovieId]);



  return (
    <>
      <Navbar >
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <Info movies={movies} />
      </Navbar>

      <Main>

        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <Movielist movies={movies} setselectedmovieId={handleMovieSelection} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedmovieId ?
            <>
              <button className="btn-back" onClick={handleBack}>&larr;</button>
              <MovieDetails
                movieId={selectedmovieId}
                addMovie={addnewmovie}
                watched={watched}
              />
            </>

            :
            <>

              <MovieSummary watched={watched} />
              <WathcedMovieList watched={watched} handleDelete={handleDelete} />
            </>}
        </Box>

      </Main>
    </>
  );
}


function ErrorMessage({ message }) {
  return <div className="error">⛔ {message}</div>
}
function Loader() {
  return <div className="loader">Loading...</div>
}
function Main({ children }) {
  return <main className="main">
    {children}
  </main>
}

function Box({ movies, children, setselectedmovieId }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>

      {isOpen1 && (
        children
      )}

    </div>
  )
}
function Movielist({ movies, setselectedmovieId }) {
  return <ul className="list list-movies">
    {movies.length === 0 && <div className="seachinfo">Enter movie name to be searched</div>}
    {movies?.map((movie) => (
      <Movie
        movie={movie}
        key={crypto.randomUUID()}
        setselectedmovieId={setselectedmovieId}
      />
    ))}
  </ul>
}

function Movie({ movie, setselectedmovieId }) {

  return (

    <li key={movie.imdbID}
      onClick={() => setselectedmovieId(movie.imdbID)}>

      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3 style={{ cursor: 'pointer' }}>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

/*
function WatchedList() {
 
  const [isOpen2, setIsOpen2] = useState(true);


  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <MovieSummary watched={watched} />
          <WathcedMovieList watched={watched} />
        </>
      )}
    </div>
  )
}
*/
function MovieSummary({ watched }) {

  const avgImdbRating = average(watched.map((movie) => movie.imdbRating)).toFixed(2);
  const avgUserRating = average(watched.map((movie) => movie.userRating)).toFixed(2);

  return <>
    <div className="summary">
      <h2>Movies you watched</h2>

      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} {watched.length > 1 ? 'movies' : 'movie'} </span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        {/* <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p> */}
      </div>
    </div>
  </>
}
function WathcedMovieList({ watched, handleDelete }) {

  return (
    <ul className="list">
      {watched?.length > 0 ? (
        watched.map((movie) => (
          <WatchedMovie movie={movie} key={crypto.randomUUID()} handleDelete={handleDelete} />
        ))
      ) : (
        <div className="watchlistEmpty ">Watchlist Empty</div>
      )}
    </ul>
  );

}

function WatchedMovie({ movie, handleDelete }) {

  return <li key={movie.imdbID}>
    <img src={movie.Poster} alt={`${movie.Title} poster`} />
    <h3>{movie.Title}</h3>
    <div>
      <p>
        <span>⭐️</span>
        <span>{movie.imdbRating}</span>
      </p>
      <p>
        <span>🌟</span>
        <span>{movie.userRating}</span>
      </p>
      <p>
        <span>⏳</span>
        <span>{movie.Runtime} </span>
      </p>
      <button className="btn-delete" onClick={() => handleDelete(movie.imdbID)}>X</button>
    </div>
  </li>


}
function Navbar({ children }) {
  return <nav className="nav-bar">
    {children}
  </nav>
}

function Info({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  )

}

export const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🎬</span>
      {/* <img src="./assets/Movie.png" alt="" srcset="" /> */}
      <h1>useFlicks</h1>
    </div>
  )
}

function SearchBar({ query, setQuery }) {

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />)
}
