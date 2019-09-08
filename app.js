const registrationUrl = 'http://localhost:5000/register'
const loginUrl = 'http://localhost:5000/login'

document.addEventListener('DOMContentLoaded', () => {
    logoutPage()
    createEventListeners()
})

function initializeNavbar(){
    const arrayButtons = Array.from(document.getElementsByClassName('navbutton'))
    arrayButtons.forEach(button => {
        button.addEventListener('click', () => {
            changePage(button.innerText)
        })
    })
}

function logoutPage(){
    const pagesArray = Array.from(document.getElementsByClassName('page'))
    pagesArray.forEach(page => page.classList.add('hidden'))
    document.getElementById('registration-page').classList.add('hidden')
    document.getElementById('login-page').classList.remove('hidden')
}

function changePage(page){
    page = page.replace(/\s+/g, '').toLowerCase()
    const pagesArray = Array.from(document.getElementsByClassName('page'))
    pagesArray.forEach(page => page.classList.add('hidden'))
    document.getElementById(`${page}-page`).classList.remove('hidden')
}



function testRegistrationInputs(){
    const inputArray = Array.from(document.getElementsByClassName('register_input'))
    let bool = true
    inputArray.map(input => {
        if (input.value.trim().length <= 0){
            bool = false
        }
    })

    bool == true
        ? register(inputArray)
        : rejectInput()
}

function testLoginInputs(){
    let inputs = Array.from(document.getElementsByClassName('login-input'))
    let bool = true
    inputs.map(input => {
        if (input.value.trim().length <= 0){
            bool = false
        }
    })

    bool == true
        ? attemptLogin(inputs)
        : rejectInput()
}

function attemptLogin(inputs){
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: inputs[0].value,
            password: inputs[1].value
        })
    }).then(res => res.json())
    .then(userInfo => login(userInfo))
}

function login(userInfo){
    if (userInfo == 'no user with that username found' || userInfo == 'failure') {
        console.log('failed')
        return
    }
const loggedOutFormsArray = Array.from(document.getElementsByClassName('logged-out'))
    loggedOutFormsArray.forEach(form => {
        form.classList.add('hidden')
    })
    changePage('favorites')
    initializeNavbar()
}

function register(inputs){
    fetch(registrationUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "name": inputs[0].value,
            "username": inputs[1].value,
            "password": inputs[2].value
        })
    }).then(res => res.json())
    .then(json => {
        registerSuccess(json)
    })
}

function registerSuccess(response){
    if (response.includes("Congrats")) {
        document.getElementById('login-redirect').click()
    }
}

function rejectInput(){
    alert('One or more inputs are invalid or empty, make sure there are no empty textfields.')
}

function createEventListeners(){
    const signupRedirect = document.getElementById('signup-redirect')
    signupRedirect.addEventListener('click', (event) => { 
        event.preventDefault()
        logoutPage()
        document.getElementById('login-page').classList.add('hidden')
        document.getElementById('registration-page').classList.remove('hidden')
    })

    const loginRedirect = document.getElementById('login-redirect')
    loginRedirect.addEventListener('click', (event) => {
        event.preventDefault()
        logoutPage()
    })

    const registerButton = document.getElementById('register')
    registerButton.addEventListener('click', (event) => {
        event.preventDefault()
        testRegistrationInputs()
    })

    const loginButton = document.getElementById('login')
    loginButton.addEventListener('click', (event) => {
        event.preventDefault()
        testLoginInputs()
    })

    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', () => {
        event.preventDefault()
        window.location.reload()
    })
}

