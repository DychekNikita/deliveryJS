'use strict';

const cartButton = document.querySelector("#cart-button"),
  modal = document.querySelector(".modal"),
  close = document.querySelector(".close"),
  buttonAuth = document.querySelector('.button-auth'),
  modalAuth = document.querySelector('.modal-auth'),
  closeAuth = document.querySelector('.close-auth'),
  logInForm = document.querySelector('#logInForm'),
  loginInput = document.querySelector('#login'),
  userName = document.querySelector('.user-name'),
  buttonOut = document.querySelector('.button-out'),
  cardsRestaurants = document.querySelector('.cards-restaurants'),
  containerPromo = document.querySelector('.container-promo'),
  restaurants = document.querySelector('.restaurants'),
  menu = document.querySelector('.menu'),
  logo = document.querySelector('.logo'),
  cardsMenu = document.querySelector('.cards-menu'),
  restaurantHeading = document.querySelector('.restaurant-heading');

let login = localStorage.getItem('userData');

const getData = async function(url) {
  const response = await fetch(url);   
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }

  return await response.json();
  
};

getData('../db/partners.json');

function toggleModal() {
  modal.classList.toggle("is-open");
};
function toggleModalAuth() {
  modalAuth.classList.toggle('is-open')
};

function autorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('userData');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  };

  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
};

function notAutorized() {
  console.log('Не авторизован');

  function logIn(event) {
    if (!loginInput.value) {
      alert('Необходимо заполнить обязательные поля!')
      event.preventDefault();
    } else {
      event.preventDefault();
      login = loginInput.value;
      localStorage.setItem('userData', login);
      toggleModalAuth();
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();
    };
  };

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
};

function checkAuth() {
  if (login) {
    autorized();
  } else {
    notAutorized();
  };
};

checkAuth();

function createCardRestaurant({ image, kitchen, name,
   price, stars, products,
   time_of_delivery: timeOfDelivery }) {

  const card = `<a class="card card-restaurant" data-products="${products}">
  <img src="${image}" alt="image" class="card-image"/>
  <div class="card-text">
    <div class="card-heading">
      <h3 class="card-title">${name}</h3>
      <span class="card-tag tag">${timeOfDelivery} мин</span>
    </div>
    <div class="card-info">
      <div class="rating">
        ${stars}
      </div>
      <div class="price">От ${price} ₽</div>
      <div class="category">${kitchen}</div>
    </div>
  </div>
</a>
`;

  cardsRestaurants.insertAdjacentHTML('beforeend', card)

};

function createRestaurantHeading({ kitchen, name,
  price, stars }) {
  const heading = `
  <div class="section-heading">
  <h2 class="section-title restaurant-title">${name}</h2>
  <div class="card-info">
    <div class="rating">
      ${stars}
    </div>
    <div class="price">От ${price} ₽</div>
    <div class="category">${kitchen}</div>
  </div>
  <!-- /.card-info -->
</div>
  `;
  restaurantHeading.insertAdjacentHTML('afterbegin', heading);
};

function createCardGood({ description, image, name, price }) { 

  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend',  `
      <img src="${image}" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title card-title-reg">${name}</h3>
        </div>
        <div class="card-info">
          <div class="ingredients">${description}
          </div>
        </div>
        <div class="card-buttons">
          <button class="button button-primary button-add-cart">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price-bold">${price}₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
  
};


function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');
  console.log(restaurant);
  if (!login && !localStorage.getItem('userData')) {
    toggleModalAuth()
  } else {

  if (restaurant) {

    cardsMenu.textContent = '';
    restaurantHeading.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
  

    getData(`../db/${restaurant.dataset.products}`).then(function (data) {   
      data.forEach(createCardGood);
    });
    getData('../db/partners.json').then(function (data) {
      data.forEach(createRestaurantHeading);

     /* data.forEach(function(item) {
        let restName = document.querySelectorAll('.card-title');
          restName.forEach(function(card) {
            console.log(card.textContent);
            
          });
        
        console.log(item.name);
        if (item.name === card.textContent) {
            alert('1');
        };
        
      });*/
  });

  };
};
};

function init() {
  getData('../db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);

    
    
});

cartButton.addEventListener("click", toggleModal);

close.addEventListener("click", toggleModal);

closeAuth.addEventListener('click', toggleModalAuth);

cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});
}

init();