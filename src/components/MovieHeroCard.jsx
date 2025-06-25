import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MovieHeroCarousel({ movies }) {
  const IMG_API = "https://image.tmdb.org/t/p/w1280/";
  const apiKey = import.meta.env.VITE_API_KEY;
  const [imdbIds, setImdbIds] = useState({});

  useEffect(() => {
    const fetchImdbIds = async () => {
      const firstThree = movies.slice(0, 3);
      const promises = firstThree.map((movie) =>
        axios
          .get(
            `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`
          )
          .then((res) => ({ id: movie.id, imdb_id: res.data.imdb_id }))
          .catch((error) => {
            console.error(
              "Failed to fetch IMDb ID for movie:",
              movie.title,
              error
            );
            return { id: movie.id, imdb_id: null };
          })
      );

      const results = await Promise.all(promises);
      const idMap = {};
      results.forEach(({ id, imdb_id }) => {
        idMap[id] = imdb_id;
      });

      setImdbIds(idMap);
    };

    if (movies.length > 0) fetchImdbIds();
  }, [movies]);

  return (
    <div
      id="movieHeroCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
      style={{ maxWidth: "1300px", margin: "2rem auto" }}
    >
      <div className="carousel-indicators">
        {movies.slice(0, 3).map((_, index) => (
          <button
            key={index}
            type="button"
            data-bs-target="#movieHeroCarousel"
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-current={index === 0 ? "true" : undefined}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>

      <div className="carousel-inner rounded shadow-lg overflow-hidden">
        {movies.slice(0, 3).map((movie, index) => {
          const imdbLink = imdbIds[movie.id]
            ? `https://www.imdb.com/title/${imdbIds[movie.id]}`
            : "#";

          return (
            <div
              key={movie.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              style={{ height: "400px", position: "relative" }}
            >
              <img
                src={IMG_API + movie.backdrop_path}
                className="d-block"
                alt={movie.title}
                style={{
                  width: "150%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "left center",
                  filter: "brightness(0.5)",
                }}
              />

              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.9), rgba(0,0,0,0))",
                }}
              ></div>

              <div
                className="position-absolute top-0 start-0 h-100 d-flex flex-column justify-content-center p-5 text-white"
                style={{ width: "85%" }}
              >
                <h2 className="fw-bold">{movie.title}</h2>
                <p style={{ fontSize: "0.95rem" }}>{movie.overview}</p>
                <a
                  href={imdbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-warning text-dark fw-bold mt-2"
                  style={{ width: "fit-content" }}
                >
                  View on IMDb
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
