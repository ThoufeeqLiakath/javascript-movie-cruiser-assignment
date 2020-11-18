const BASE_URL = "https://image.tmdb.org/t/p/original";
let moviesFromDb = [];
let favouritesFromDb = [];

function getMovies() {
	return fetch("http://localhost:3000/movies").then((res) => {
		if (res.status == 200)
			return Promise.resolve(res.json());
		else
			return Promise.reject(res.status + ':' + res.statusText);
	}).then((movies) => {
		moviesFromDb = movies;
		FormHtml(movies, "moviesList");
		return movies;
	}).catch((error) => {
		throw new Error(error);
	});
}

function getFavourites() {
	return fetch("http://localhost:3000/favourites").then((res) => {
		if (res.status == 200)
			return Promise.resolve(res.json());
		else
			return Promise.reject(res.status + ':' + res.statusText);
	}).then((movies) => {
		favouritesFromDb = movies;
		FormHtml(movies, "favouritesList");
		return movies;
	}).catch((error) => {
		throw new Error(error);
	});
}

function addFavourite(id) {
	let fav = moviesFromDb.find(x => x.id == id);
	let favIsExists = favouritesFromDb.find(x => x.id == id);
	if (favIsExists == undefined) {
		return fetch("http://localhost:3000/favourites", {
			method: 'POST',
			body: JSON.stringify(fav),
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
		}).then((res) => {
			if (res.status == 200 || res.status == 201)
				return Promise.resolve(res.json());
			else
				return Promise.reject(res.status + ':' + res.statusText);
		}).then((addedMovie) => {
			favouritesFromDb.push(addedMovie);			
			let tempList = [addedMovie];
			FormHtml(tempList, "favouritesList");
			return favouritesFromDb;
		}).catch((err) => {
			console.info(err)
		});
	}
	else {
		throw new Error('Movie is already added to favourites');
	}
}

let ConstructMovieCards = function (poster_path, title, overview, id, movieId) {

	var li = document.createElement("li");
	li.className = ("list-group-item");
	// li.setAttribute("style","width:50%;")
	var outerDiv = document.createElement("div")
	outerDiv.className = ("card");
	var innerDiv = document.createElement("div")
	innerDiv.className = ("card-body");
	var img = document.createElement("img");
	img.className = ("card-img-top");
	if (poster_path != undefined && poster_path != null) {
		img.setAttribute("src", BASE_URL + poster_path);
	}

	var h5 = document.createElement("h5");
	h5.className = ("card-title");
	h5.innerHTML = (title);
	if (id == "moviesList") {
		var button = document.createElement("button");
		button.innerHTML = "Add To Favourites";
		button.className = "bg-warning";
		let func = function () { addFavourite(movieId) };
		button.addEventListener("click", func);
	}

	var p = document.createElement("p");
	p.className = ("card-text");
	p.innerHTML = (overview);
	innerDiv.appendChild(h5);


	innerDiv.appendChild(p);
	outerDiv.appendChild(img);
	outerDiv.appendChild(innerDiv);
	if (id == "moviesList") {
		outerDiv.appendChild(button);
	}
	li.appendChild(outerDiv);
	var ul = document.getElementById(id);
	ul.appendChild(li);
};

let FormHtml = function (movies, id) {
	movies.forEach(element => {
		ConstructMovieCards(element.poster_path, element.title, element.overview, id, element.id)
	});
};

module.exports = {
	getMovies,
	getFavourites,
	addFavourite
};



// You will get error - Uncaught ReferenceError: module is not defined
// while running this script on browser which you shall ignore
// as this is required for testing purposes and shall not hinder
// it's normal execution


