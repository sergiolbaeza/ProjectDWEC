const calendar = document.getElementsByClassName("days").item(0);
const yesterday = document.getElementById("yesterday");
const tomorrow = document.getElementById("tomorrow");
const actualDay = document.getElementById("actual-day");
const days = document.getElementsByClassName("day");
const movieListHeader = document.getElementById("h_movies");
// Navigation bar stuff
const addMovieButton = document.getElementById("add-movie");
const addNavPopup = document.getElementById("add-popup");
const movieForm = document.getElementById("movie-form");
const navPopup = document.getElementById("nav-popup");
const removeMovieButton = document.getElementById("remove-movie-button");
const watchMovieButton = document.getElementById("watch-movie-button");
const removeMovieForm = document.getElementById("remove-movie-form");
const watchMovieForm = document.getElementById("watch-movie-form");

const monthText = [
	'January', 'February', 'March', 'April',
	'May', 'June', 'July', 'August',
	'September', 'October', 'November', 'December'
];

const makeVisible = (element, bool = true) => {
	if (bool) {
		element.classList.remove("hidden");
	} else {
		element.classList.add("hidden");
	}
}


const actualDate = new Date();

// This doesn't work because of browser defaults 
// addMoviesFromJSONFile = (movieListObject) => {
// 	fetch("./movies.json")
// 		.then(response => response.json())
// 		.then(moviesJson => movieListObject.addMovieJSON(movies))
// 		.catch(error => console.error('There was an error. The error was: ', error));
// }

const calendar1 = new Calendar(actualDate.getMonth() + 1, actualDate.getFullYear(), actualDate.getDate());
const movieList1 = new MovieList(calendar1);
movieList1.addMovieJSON(moviesJsonString);
movieList1.addMovieListArticle();

addMovieButton.onclick = () => makeVisible(movieForm, true);
addNavPopup.onclick = () => makeVisible(navPopup, true);
removeMovieButton.onclick = () => makeVisible(removeMovieForm, true);
watchMovieButton.onclick = () => makeVisible(watchMovieForm, true);

document.body.addEventListener("keydown", (event) => {
	if (event.code === "KeyM") {
		alert("You pressed the letter 'm'")
	};
})

document.body.addEventListener("keydown", (event) => {
	if (event.code === "Escape") {
		makeVisible(movieForm, false);
		makeVisible(navPopup, false);
		makeVisible(movieBox, false);
	}
})

const buttons = Object.values(document.getElementsByTagName("button")).concat(Object.values(document.getElementsByClassName("button")));

buttons.forEach(button => {
	button.addEventListener("mouseover", () => {
		button.classList.add("hovered");
	});
});

buttons.forEach(button => button.addEventListener("mouseout", () => {
	button.classList.remove("hovered");
}));