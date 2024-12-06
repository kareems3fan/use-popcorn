import { useState } from "react";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import MovieDetails from "./Components/Movie/movieDetails";
import NavBar from "./Components/Movie/assets/NavBar";
import Loader from "./Components/Movie/assets/Loader";
import ErrorMessage from "./Components/Movie/assets/errorMessage";
import Search from "./Components/Movie/assets/search";
import WatchedSummary from "./Components/Movie/watchedSummary";
import WatchedMoviesList from "./Components/Movie/watchedList";
import MovieList from "./Components/Movie/movieList";
import Box from "./Components/Movie/box";
import NumResults from "./Components/Movie/numResult";
import Main from "./Components/Movie/Main";



export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], 'watched');


  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {

    setWatched((watched) => [...watched, movie]);

  }
  function handleDeleteWatched(id) {
    setWatched(watched => watched.filter(movie => movie.imdbID !== id))
  }


  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (<MovieList movies={movies} onSelectMovie={handleSelectMovie} />)}

          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ?

            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}>


            </MovieDetails> :
            (<>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList watched={watched} onDeleteWatched={handleDeleteWatched} />


            </>
            )}
        </Box>
      </Main>
    </>
  );
}








