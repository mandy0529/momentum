'use strict';

// 시계 변수
const clock = document.querySelector('.clock');

// 사용자 변수
const whoInput = document.querySelector('.whoinput');
const who = document.querySelector('.who');
const greeting = document.querySelector('.greeting');
const CURRENT_NAME = 'currentName';

// to do list 변수
const whatInput = document.querySelector('.whatinput');
const what = document.querySelector('.what');
const CURRENT_TODO = 'currentTodo';
const ul = document.querySelector('.todos');
let TODOARRAY = [];

// background 변수
const body = document.querySelector('body');

// 날씨 변수
const coords = document.querySelector('.coords');
const API_KEY = 'b7a5f9fdb17020d83c1775bcae79bc53';
const COORDS = 'coords';
// --------------------------------

// 시계 함수
function initClock() {
  getTime();
  setInterval(() => {
    getTime();
  }, 1000);
}
initClock();

function getTime() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const clockDate = date.getDate();
  const day = date.getDay();
  const week = ['sun', 'mon', 'tue', 'wed', 'thr', 'fri', 'sat'];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  clock.innerText = `${year}.${month < 10 ? `0${month}` : month}.${
    clockDate < 10 ? `0${clockDate}` : clockDate
  } ${week[day]}
    ${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}
// --------------------

// 사용자 함수
function initText() {
  paintWhoInput();
  loadName();
}
initText();
function paintWhoInput() {
  who.addEventListener('focus', (event) => {
    event.target.classList.add('who--ani');
    event.target.removeAttribute('placeholder');
  });
  who.addEventListener('blur', (event) => {
    event.target.classList.remove('who--ani');
    event.target.setAttribute('placeholder', 'What is your name?');
  });
}
function loadName() {
  const currentName = localStorage.getItem(CURRENT_NAME);
  if (currentName === null) {
    askForName();
  } else {
    showGreeting(currentName);
    showTodoList();
  }
}
function askForName() {
  who.classList.add('who--visible');
  whoInput.addEventListener('submit', handleUserName);
}
function handleUserName(event) {
  event.preventDefault();
  const text = who.value;
  if (text === '') {
    return;
  }
  who.value = '';
  who.focus();
  showTodoList();
  hideWhoInput();
  showGreeting(text);
  saveName(text);
}
function showGreeting(text) {
  greeting.classList.add('greeting--visible');
  greeting.innerText = `Hello! ${text}👋🏻 
    What is your goal for today?`;
}
function hideWhoInput() {
  who.classList.remove('who--visible');
}
function showTodoList() {
  what.classList.add('what--visible');
}
function saveName(text) {
  localStorage.setItem(CURRENT_NAME, text);
}
// --------------------

// to do list 함수
function initTodoList() {
  paintWhatInput();
  loadTodoList();
  whatInput.addEventListener('submit', handleTodoList);
}
initTodoList();
function paintWhatInput() {
  what.addEventListener('focus', (event) => {
    event.target.classList.add('what--ani');
    event.target.removeAttribute('placeholder');
  });
  what.addEventListener('blur', (event) => {
    event.target.classList.remove('what--ani');
    event.target.setAttribute('placeholder', '+ write a to do');
  });
}
function handleTodoList(event) {
  event.preventDefault();
  const text = what.value;
  if (text === '') {
    return;
  }
  what.value = '';
  what.focus();
  paintTodo(text);
  saveTodo(text);
}
function paintTodo(text) {
  const li = document.createElement('li');
  const newId = TODOARRAY.length + 1;
  li.setAttribute('id', newId);
  li.innerHTML = `
    <li class="todos__row">
        <div class="todos__row-name">${text}</div>
        <button class="todos__row-delete">✔️</button>
    </li>
    <div class="row-divider"></div>`;
  ul.appendChild(li);
  li.scrollIntoView(text);
  const arrayObj = {
    text: text,
    id: newId,
  };
  TODOARRAY.push(arrayObj);
  saveTodo(text);
}
function saveTodo() {
  localStorage.setItem(CURRENT_TODO, JSON.stringify(TODOARRAY));
}
function loadTodoList() {
  const currentTodo = localStorage.getItem(CURRENT_TODO);
  if (currentTodo !== null) {
    const parsedTodo = JSON.parse(currentTodo);
    parsedTodo.forEach(function (toDo) {
      paintTodo(toDo.text);
      console.log(toDo.text);
    });
  }
}
ul.addEventListener('click', (event) => {
  const target = event.target;
  const deleteBtn = target.nodeName === 'BUTTON';
  if (deleteBtn) {
    handleDeleteBtn(event);
  }
});
function handleDeleteBtn(event) {
  const deleteList = event.target.parentNode.parentNode;
  ul.removeChild(deleteList);
  const cleanTODOARRAY = TODOARRAY.filter(function (toDo) {
    return toDo.id !== parseInt(deleteList.id);
  });
  TODOARRAY = cleanTODOARRAY;
  saveTodo();
}
// --------------------

// 백그라운드 함수
window.onload = randombg();

function initBackground() {
  setInterval(() => {
    randombg();
  }, 3000);
}
initBackground();

function randombg() {
  const randomNumber = Math.ceil(Math.random() * 6);
  let bg = [
    "url('img/1.jpeg')",
    "url('img/2.jpeg')",
    "url('img/3.jpeg')",
    "url('img/4.jpeg')",
    "url('img/5.jpeg')",
    "url('img/6.jpeg')",
  ];
  body.style.backgroundImage = bg[randomNumber];
}
// --------------------

// 날씨 함수
function initWeather() {
  loadCoords();
}
initWeather();
function loadCoords() {
  const loadedCoords = localStorage.getItem(COORDS);
  if (loadedCoords === null) {
    askForCoords();
  } else {
    const parsedCoords = JSON.parse(loadedCoords);
    getWeather(parsedCoords.latitude, parsedCoords.longitude);
  }
}
function askForCoords() {
  navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError);
}
function handleGeoSucces(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const coordsObj = {
    latitude,
    longitude,
  };
  saveCoords(coordsObj);
}
function handleGeoError() {
  console.log('cannot access gel location');
}
function saveCoords(coordsObj) {
  localStorage.setItem(COORDS, JSON.stringify(coordsObj));
}
function getWeather(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      const temperature = json.main.temp;
      const location = json.name;
      coords.innerText = `${temperature}°C , ${location}`;
    });
}
