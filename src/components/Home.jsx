import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import MovieCard from "./MovieCard";
import MovieHeroCard from "./MovieHeroCard";

export default function Content() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const FEATURED_API = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${apiKey}&page=1`;
  const SEARCH_API = `https://api.themoviedb.org/3/search/movie?&api_key=${apiKey}&query=`;
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMovies() {
      const movieApi = await fetch(FEATURED_API);
      const data = await movieApi.json();
      setMovies(data.results);
    }
    fetchMovies();
  }, []);

  useEffect(() => {
    async function fetchSearchResults() {
      if (search.trim() === "") {
        const movieApi = await fetch(FEATURED_API);
        const data = await movieApi.json();
        setMovies(data.results);
      } else {
        try {
          const movieApi = await fetch(SEARCH_API + encodeURIComponent(search));
          const data = await movieApi.json();
          setMovies(data.results || []);
        } catch (error) {
          console.error("Failed to fetch movies:", error);
        }
      }
    }
    fetchSearchResults();
  }, [search]);

  function handleOnChange(e) {
    setSearch(e.target.value);
  }

  return (
    <>
      <header className="d-flex flex-column flex-md-row align-items-center justify-content-between py-3 mb-4">
        <div className="mb-3 mb-md-0 text-decoration-none text-center text-md-start">
          <h1 className="fs-4 mb-0">Featured Movie</h1>
        </div>

        <div className="d-flex align-items-center">
          <form
            className="d-flex"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="form-control me-2 bg-dark text-white border-0"
              type="search"
              placeholder="Search..."
              aria-label="Search"
              value={search}
              onChange={handleOnChange}
              autoComplete="off"
            />
          </form>
        </div>
      </header>

      {movies.length >= 3 && search.trim() === "" && (
        <div className="bg-dark">
          <MovieHeroCard movies={movies} />
        </div>
      )}

      <h1 className="fs-4 mt-4">
        {search.trim() === ""
          ? "Popular Movies"
          : `Search results for "${search}"`}
      </h1>

      <div className="container py-4">
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 g-4 justify-content-center justify-content-sm-start">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </>
  );
}
