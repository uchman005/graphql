const loginForm = document.querySelector('#loginForm');
const authContainer = document.querySelector('.authContainer');
const usernameInput = document.querySelector("#usernameEmail");
const passwordInput = document.querySelector("#password");
const errorText = document.querySelector("#error");
const body = document.querySelector("body");
const logoutBtn = document.querySelector("#logoutBtn");
const loginContainer = document.querySelector(".loginContainer");
const loginBtn = document.querySelector("#loginBtn");
const userData = document.querySelector("#userData");
const title = document.querySelector("title");
loginForm.addEventListener('submit', login);
logoutBtn.addEventListener('click', logout)
addEventListener('load', checkLoginStatus);