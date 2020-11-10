// Your API key: 19039740-85522b5907a9a533107e508ea
import cardsImgsTpl from './templates/cardTpl.hbs';
import NewsApiService from "./apiService";
import LoadMoreBtn from './loadmore';


import { inform, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';


  

const refs = {
  searchForm: document.querySelector('.search-form'),
  cardsContainer: document.querySelector('.gallery'),
};
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const newsApiService = new NewsApiService();

refs.searchForm.addEventListener('submit', onSearchQuery);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);


function onSearchQuery(event) {
  event.preventDefault();

  newsApiService.query = event.currentTarget.elements.query.value;

  if (newsApiService.query === '') {
    return inform({
      text: 'Enter the value!',
      delay: 1500,
      closerHover: true,
    });
  }

  loadMoreBtn.show();
  newsApiService.resetPage();
  clearCardsContainer();
  fetchCards();
}

function fetchCards() {
  loadMoreBtn.disable();
  return newsApiService.fetchCards().then(images => {
    appendCardsMarkup(images);
    loadMoreBtn.enable();
    if (images.length === 0) {
      loadMoreBtn.hide();
      error({
        text: 'No matches found!',
        delay: 1500,
        closerHover: true,
      });
    }
  });
}

function appendCardsMarkup(images) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', cardsImgsTpl(images));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}


function onLoadMore() {
  fetchCards()
    .then(
      setTimeout(() => {
        window.scrollBy({
          top: document.documentElement.clientHeight - 100,
          behavior: 'smooth',
        });
      }, 1500),
    )
    .catch(err => console.log(err));
}
// https://pixabay.com/api/?key=19039740-85522b5907a9a533107e508ea&q=yellow+flowers&image_type=photo