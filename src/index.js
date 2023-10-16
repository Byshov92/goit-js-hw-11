import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const loadMoreButton = document.querySelector('.load-more');
const imagesSearchForm = document.querySelector('#search-form');
const imagesGalleryContainer = document.querySelector('.gallery');
const perPage = 40;
let currentPage = 1;
let totalHits = 0;

async function fetchImages(searchQuery) {
  const KEY = '35853689-a03383622ee3e9fbd6938dad1';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  try {
    const response = await axios.get(url);

    totalHits = response.data.totalHits; 
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

function displayImages(imagesArea) {


  imagesArea.forEach(({ largeImageURL, webformatURL, tags, likes, views, comments, downloads }) => {
    const html = `
      <a class="card-link" href="${largeImageURL}"><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${downloads}
          </p>
        </div>
      </div></a>`;

    imagesGalleryContainer.insertAdjacentHTML('beforeend', html);

       });

   const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();


updateLoadMoreButton(imagesArea.length);

};

function updateLoadMoreButton(imagesCount) {
  if (imagesCount < perPage || currentPage * perPage >= totalHits) {
    loadMoreButton.style.display = 'none';
    displayNoImagesMessage();
  } else {
    loadMoreButton.style.display = 'block';
  }
};

function displayNoImagesMessage() {
  if (currentPage === 1) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  } else {
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
  }
};

imagesSearchForm.addEventListener('submit', async evt => {
  evt.preventDefault();

  const searchQueryInput = document.querySelector('.search-form input[name="searchQuery"]');
  const searchQuery = searchQueryInput.value.trim();
  if (searchQuery !== '') {

imagesGalleryContainer.innerHTML = '';
    

    loadMoreButton.style.display = 'none';
    currentPage = 1;

    try {
      const data = await fetchImages(searchQuery);
      if (data.hits.length === 0) {
        displayNoImagesMessage();
      } else {
        setTimeout(() => {
          displayImages(data.hits);
          loadMoreButton.style.display = 'block';
        }, 500);
      }
    } catch (error) {
      console.error(error);
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    }
  } else {
    imagesGalleryContainer.innerHTML = '';
    Notiflix.Notify.failure('Please enter a valid search query.');
     loadMoreButton.style.display = 'none';
  }
});


loadMoreButton.addEventListener('click', async () => {

  const searchQuery = document.querySelector('.search-form input[name="searchQuery"]').value.trim();
  
  if (searchQuery !== '') {
    currentPage++;
    try {
      const data = await fetchImages(searchQuery);
         setTimeout(() => {
          displayImages(data.hits);
         }, 500);
      }catch (error) {
        console.error(error);
        Notiflix.Notify.failure('Sorry, there was an error while loading more images.');
      };
  }
});