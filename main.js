const calendar = document.getElementsByClassName("days").item(0);
const actualDay = document.getElementById("actual-day");
const yesterday = document.getElementById("yesterday");
const tomorrow = document.getElementById("tomorrow");
const days = document.getElementsByClassName("day");
const movieListHeader = document.getElementById("h_movies");
// Navigation bar stuff
const addMovieButton = document.getElementById("add-movie");
const addMoviePopup = document.getElementById("movie-popup");


const monthText = [
	'January', 'February', 'March', 'April',
	'May', 'June', 'July', 'August',
	'September', 'October', 'November', 'December'
];

const ACTUAL = "actual framed day";
const DAY = "framed day";

class Calendar {
	constructor(month, year, day) {
		this.month = month;
		this.year = year;
		this.day = day;
		this.bindControls();
		this.printCalendar();
	}

	increaseYear = () => this.year++;

	increaseMonth = () => {
		if (this.month == 12) {
			this.increaseYear();
			this.month = 1;
		} else {
			this.month += 1;
		}
		this.printCalendar();
	}

	increaseDay = () => {
		if (this.day == this.daysInMonth()) {
			this.increaseMonth();
			this.day = 1;
		} else {
			this.day += 1;
		}
		this.updateDay();
	}

	reduceDay = () => {
		if (this.day == 1) {
			this.reduceMonth();
			this.day = this.daysInMonth();
		} else {
			this.day -= 1;
		}
		this.updateDay();
	}

	reduceMonth = () => {
		if (this.month == 1) {
			this.reduceYear();
			this.month = 12;
		} else {
			this.month -= 1;
		}
		this.printCalendar();
	}

	reduceYear = () => this.year -= 1;

	printDay = (element) => element.textContent = `${monthText[this.month - 1]} ${this.day}, ${this.year}`;

	daysInMonth = () => new Date(this.year, this.month, 0).getDate();

	firstDay = () => new Date(this.year, this.month - 1, 1).getDay();

	printCalendar = () => {
		const calendarChildNodes = [];
		const firstDay = this.firstDay();
		const daysInMonth = this.daysInMonth();
		if (firstDay > 1) {
			for (let index = 1; index < firstDay; index++) {
				calendarChildNodes.push(Calendar.appendDay('', false));
			}
		}
		for (let index = 1; index <= daysInMonth; index++) {
			const dayElement = index == this.day
				? Calendar.appendDay(index, true)
				: Calendar.appendDay(index, false);
			calendarChildNodes.push(dayElement);
		}
		calendar.replaceChildren(...calendarChildNodes);
		this.printDay(actualDay);
	}

	setDay = (day) => {
		this.day = day;
		this.updateDay();
	}

	updateDay = () => {
		[...days].forEach((day, index) => {
			if (day.textContent == this.day) {
				days.item(index).setAttribute("class", ACTUAL);
			} else if (day.getAttribute("class") == ACTUAL) {
				days.item(index).setAttribute("class", DAY);
			}
		});
		this.printDay(actualDay);
		dispatchEvent(new Event('dateUpdated'));
	}

	static appendDay = (day, actual) => {
		const dayElement = document.createElement("time");
		if (actual) {
			dayElement.setAttribute("class", ACTUAL);
		} else {
			dayElement.setAttribute("class", DAY);
		}
		dayElement.textContent = day;
		return dayElement;
	}

	getDate = () => {
		return new Date(this.year, this.month, this.day);
	}

	bindControls = () => {
		yesterday.onclick = () => this.reduceDay();
		tomorrow.onclick = () => this.increaseDay();
		calendar.addEventListener("click", (day) => {
			if (day.target && day.target.tagName == "TIME" && day.target.textContent.length != 0) {
				this.setDay(parseInt(day.target.textContent));
			}
		})
	}
}

class MovieList {
	constructor(calendar) {
		this.movieList = [];
		this.calendar = calendar;
		this.printDate();
		addEventListener("dateUpdated", () => {
			this.printDate();
			this.addMovieListArticle();
		});
	}

	addMovie = (movie) => {
		this.movieList.push(movie);
	}

	addMovieJSON = (movieJSON) => {
		this.addMovies(JSON.parse(movieJSON).movies);
	}

	addMovies = (movies) => movies.forEach(this.addMovie);

	printDate = () => this.calendar.printDay(movieListHeader);

	addMovieListArticle = () => {
		// Create a new article for the list of movies
		const movieListArticle = document.createElement('article');

		this.movieList.forEach(movie => {
			// Create a div for each movie
			const movieDiv = document.createElement('div');
			movieDiv.setAttribute("class", "movie bordered");

			// Add the title of the movie
			const movieTitle = document.createElement('h2');
			movieTitle.textContent = movie.title;
			movieDiv.appendChild(movieTitle);

			// Add the movie year to the div
			const movieYear = document.createElement('p');
			movieYear.textContent = `Year: ${movie.year}`;
			movieDiv.appendChild(movieYear);

			// Add the movie director to the div
			const movieDirector = document.createElement('p');
			movieDirector.textContent = `Director: ${movie.director}`;
			movieDiv.appendChild(movieDirector);

			// Create a new div for the cast
			const castDiv = document.createElement('div');

			// Loop through each actor in the cast array
			movie.cast.forEach(actor => {
				// Add the actor to the cast div
				const castMember = document.createElement('p');
				castMember.textContent = actor;
				castDiv.appendChild(castMember);
			});

			// Add the cast div to the movie div
			movieDiv.appendChild(castDiv);

			// Add the movie div to the article
			movieListArticle.appendChild(movieDiv);
		})
		movieListHeader.parentNode.replaceChild(movieListArticle, movieListHeader.nextSibling);
	}
}

const movieJsonString = `{
    "movies": [
        {
            "title": "Silent Night",
            "year": 2023,
			"month": 11,
			"day": 30,
            "director": "Camille Griffin",
            "cast": [
                "Keira Knightley",
                "Lily-Rose Depp",
                "Matthew Goode"
            ]
        },
        {
            "title": "Candy Cane Lane",
            "year": 2023,
			"month": 10,
			"day": 1,
            "director": "Maggie Carey",
            "cast": [
                "Emma Stone",
                "Ryan Gosling",
                "Zoey Deutch"
            ]
        },
        {
            "title": "Renaissance: A Film By Beyoncé",
            "year": 2023,
			"month": 12,
			"day": 21,
            "director": "Beyoncé and Ed Burke",
            "cast": []
        }
    ]
}`;

const actualDate = new Date();

const calendar1 = new Calendar(actualDate.getMonth() + 1, actualDate.getFullYear(), actualDate.getDate());
const movieList1 = new MovieList(calendar1);
movieList1.addMovieJSON(movieJsonString);
movieList1.addMovieListArticle();

addMovieButton.onclick = () => addMoviePopup.style.display = addMoviePopup.style.display == 'none'
	? 'flex'
	: 'none';