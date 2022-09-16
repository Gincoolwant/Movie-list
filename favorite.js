const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []
let filteredMovies = []
const moviesPerPage = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3 mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster" />
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#More-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
          </div>
        </div>
    </div>`
  })

  dataPanel.innerHTML = rawHTML
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function removeFavorite(id) {
  console.log(movies.length)
  if (!movies || !movies.length) return 
  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return

  movies.splice(movieIndex,1)

  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * moviesPerPage
  return data.slice(startIndex, startIndex + moviesPerPage)
}

function renderPaginator(amount) {
  const totatlPage = Math.ceil(amount / moviesPerPage)
  let rawHTML = ''
  for (let page = 1; page <= totatlPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML

}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('click', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) => {
    return movie.title.toLowerCase().includes(keyword)
  })

  if (filteredMovies.length === 0) {
    alert(`Can not find movies with keyword: ${keyword}`)
  }

  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
})

paginator.addEventListener('click', event => {
  if (event.target.tagName !== 'A') return

  const page = event.target.dataset.page
  renderMovieList(getMoviesByPage(page))

})

renderPaginator(movies.length)
renderMovieList(getMoviesByPage(1))