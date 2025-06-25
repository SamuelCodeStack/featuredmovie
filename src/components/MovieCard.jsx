import "bootstrap/dist/css/bootstrap.min.css";
import GENRE_MAP from "../assets/GenreMap";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MovieCard(props) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const IMG_API = "https://image.tmdb.org/t/p/w1280/";

  const movie = props.movie;
  const [imdbId, setImdbId] = useState(null);

  useEffect(() => {
    const fetchImdbId = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
        );
        setImdbId(res.data.imdb_id);
      } catch (error) {
        console.error("Failed to fetch IMDb ID:", error);
      }
    };

    fetchImdbId();
  }, [movie.id]);

  const imdbLink = imdbId ? `https://www.imdb.com/title/${imdbId}` : "#";

  return (
    <div className="col" style={{ maxWidth: "180px" }}>
      <div className="card text-white border-0 bg-transparent position-relative group">
        <div className="position-relative overflow-hidden rounded">
          <img
            src={IMG_API + movie.poster_path}
            className="card-img-top"
            alt={movie.title}
            style={{ height: "270px", objectFit: "cover" }}
          />

          <div
            className="movie-hover position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between align-items-center text-center bg-dark bg-opacity-75 opacity-0 transition-opacity"
            style={{ padding: "1rem" }}
          >
            <div>
              <h2 className="fs-6 mb-2">
                {movie.vote_average.toFixed(1)} / 10
              </h2>
            </div>
            <div className="genre mb-2">
              <h2 className="fs-6">{GENRE_MAP[movie.genre_ids[1]]}</h2>
              <h2 className="fs-6">{GENRE_MAP[movie.genre_ids[2]]}</h2>
            </div>
            <div className="btn-view mb-2">
              <a
                href={imdbLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-warning btn-sm"
              >
                View Details
              </a>
            </div>
          </div>
        </div>

        <div className="card-body px-0 mt-2">
          <h6 className="card-title mb-1 fw-bold">{movie.title}</h6>
          <p className="card-text" style={{ fontSize: "0.85rem" }}>
            {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
