import { useKey } from "../../useKey";
import { useEffect } from "react";
import { useState, useRef } from "react";
import StarRating from "../../StarRating";
import Loader from "./assets/Loader";

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const KEY = "fd32c9bf";
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState('');
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const countRef = useRef(0);
  useEffect(function () {
    if (userRating)
      countRef.current++;
  }, [userRating])

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre

  } = movie;
  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDesicions: countRef.current,


    }
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }
  useKey("Escape", onCloseMovie);
  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    }
    getMovieDetails();

  }, [selectedId]);
  useEffect(function () {
    if (!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title = "MoviezLanz";
      console.log(`clean up effect for movie ${title}`)
    }
  }, [title])

  return (
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}> -</button>
            <img src={poster} alt={`Poster of ${movie} movie`}></img>
            <div className="details-overview">
              <h2>{title}</h2>
              <p> {released} &bull; {runtime} </p>
              <p>{genre}</p>
              <p> ⭐{imdbRating} imdbRating</p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ?
                <>
                  <StarRating maxRating={10} size={24} onSetRating={setUserRating} />

                  {userRating > 0 && <button className="btn-add" onClick={handleAdd}>+ Add To list</button>
                  }
                </>

                : (
                  <p>You rated with movie</p>)}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      }
    </div>

  );
}
export default MovieDetails              