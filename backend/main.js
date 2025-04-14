const API_BASE = "http://localhost:3001/v1";

document.addEventListener("DOMContentLoaded", () => {
    fetchMovies();
});

function fetchMovies() {
    fetch(`${API_BASE}/movies/list`)
        .then(res => res.json())
        .then(data => {
            if (data.status === "success") {
                const list = document.getElementById("movieList");
                list.innerHTML = "";
                data.data.forEach(movie => {
                    const item = document.createElement("li");
                    item.innerText = `${movie.title} (${movie.release_date}) — ${movie.genre}`;
                    list.appendChild(item);
                });
            }
        })
        .catch(err => console.error("Error fetching movies:", err));
}

function submitReview(e) {
    e.preventDefault();

    const form = e.target;
    const reviewData = {
        user_id: form.user_id.value,
        movie_id: form.movie_id.value,
        review: form.review.value,
        rating: form.rating.value
    };

    fetch(`${API_BASE}/movie-ratings/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(reviewData)
    })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            form.reset();
        })
        .catch(err => {
            console.error("Review submission failed:", err);
            alert("Something went wrong!");
        });
}