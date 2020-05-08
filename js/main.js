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
  restaurantHeading = document.querySelector('.restaurant-heading'),
  restaurantTitle = document.querySelector('.restaurant-title'),
  rating = document.querySelector('.rating'),
  minPrice = document.querySelector('.price'),
  category = document.querySelector('.category'),
  modalBody = document.querySelector('.modal-body'),
  modalPrice = document.querySelector('.modal-pricetag'),
  clearCart = document.querySelector('.clear-cart');

let login = localStorage.getItem('userData');
let cart = [];

const getData = async function(url) {
  const response = await fetch(url);   
  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`)
  }

  return await response.json();
};

getData('./db/partners.json');

if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
}

function getCartData() {
  localStorage.setItem('cart', JSON.stringify(cart));
  cart = JSON.parse(localStorage.getItem('cart'));
};

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
    cartButton.style.display = ''
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  };

  console.log('Авторизован');

  userName.textContent = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex'

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

  const card = `<a class="card card-restaurant" 
  data-products="${products}"
  data-info="${[name, price, stars, kitchen]}">
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

function createCardGood({ description, image, name, price, id }) { 

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
          <button class="button button-primary button-add-cart" id="${id}">
            <span class="button-card-text">В корзину</span>
            <span class="button-cart-svg"></span>
          </button>
          <strong class="card-price card-price-bold">${price}₽</strong>
        </div>
      </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
  
};

function openGoods(event) {
  const target = event.target;
  const restaurant = target.closest('.card-restaurant');
  console.log(restaurant);
  if (!login) {
    toggleModalAuth()
  } else {

  if (restaurant) {

    const info = restaurant.dataset.info.split(',');
    const [ name, price, stars, kitchen ] = info;
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');

    restaurantTitle.textContent = name;
    rating.textContent = stars;
    minPrice.textContent = `От ${price} ₽`;
    category.textContent = kitchen;
  

    getData(`./db/${restaurant.dataset.products}`).then(function (data) {   
      data.forEach(createCardGood);
    });

  };
};
};

function addToCart(event) {
  const target = event.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item) {
      return item.id === id;
    });

    if (food) {
      food.count += 1;
    } else {
       cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }; 
    getCartData();
    console.log(cart);
  };
};

function renderCart() {
  modalBody.textContent = '';
  cart.forEach(function({ id, title,cost, count }) {
    const itemCart = `
    <div class="food-row">
      <span class="food-name">${title}</span>
      <strong class="food-price">${cost} ₽</strong>
      <div class="food-counter">
        <button class="counter-button counter-minus" data-id="${id}">-</button>
        <span class="counter">${count}</span>
        <button class="counter-button counter-plus" data-id="${id}">+</button>
      </div>
    </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce(function(result, item) {
    return result + (parseFloat(item.cost)) * item.count;
  }, 0);

  modalPrice.textContent = totalPrice + ' ₽';
};

function changeCount(event) {
  const target = event.target;

    if (target.classList.contains('counter-button')) {
      const food = cart.find(function(item) {
        return item.id === target.dataset.id;
      });
       
      if (target.classList.contains('counter-minus')) {
        food.count--;
        if (food.count === 0) {
          cart.splice(cart.indexOf(food), 1);
        }
      }
      if (target.classList.contains('counter-plus')) food.count++;
      renderCart();
      getCartData();      
    };

};

function init() {
  getData('../db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
});

cartButton.addEventListener("click", function() {
  renderCart();
  toggleModal();
});

modalBody.addEventListener('click', changeCount);

cardsMenu.addEventListener('click', addToCart)
close.addEventListener("click", toggleModal);

closeAuth.addEventListener('click', toggleModalAuth);

clearCart.addEventListener('click', function() {
  cart.length = 0;
  renderCart();
  toggleModal();
  localStorage.removeItem('cart');
});


cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});
}

init();