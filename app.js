const registrationUrl = 'http://localhost:5000/register'
const loginUrl = 'http://localhost:5000/login'
const randomUrl = 'http://localhost:5000/item/random'

let randomItem = {url: '', name: '', cost: 0, highalch: 0, examine: ''}
let currentPage = 'tracked-items'
let $username = ''

document.addEventListener('DOMContentLoaded', () => {
    logoutPage()
    createEventListeners()
    loadRandomItem()
    //attemptLogin([{value: 'username'}, {value: 'password'}])

    document.querySelectorAll('.message')[0].querySelector('a').addEventListener('click', (function(){
        console.log('got to first')
        const forms = document.querySelectorAll('form')
        forms[0].style.display = 'none'
        forms[1].style.display = 'inline'
     }));



     document.querySelectorAll('.message')[1].querySelector('a').addEventListener('click', (function(){
        console.log('got to second')
        const forms = document.querySelectorAll('form')

        forms[1].style.display = 'none'
        forms[0].style.display = 'inline' 
     }));
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
    page = page.replace(/\s+/g, '-').toLowerCase()
    const pagesArray = Array.from(document.getElementsByClassName('page'))
    pagesArray.forEach(page => page.classList.add('hidden'))
    document.getElementById(`${page}-page`).classList.remove('hidden')
    if (page == 'random-item'){
        addRandomToDom()
        loadRandomItem()
    }
    currentPage = page
}

function loadRandomItem(){
    fetch(randomUrl)
        .then(resp => resp.json())
        .then(item => {
            randomItem.name = item.name
            randomItem.cost = item.cost
            randomItem.examine = item.examine
            randomItem.highalch = item.highalch
            fetch(`https://www.ge-tracker.com/assets/images/icons/${item.id}.gif`)
                .then(resp => {
                    randomItem.url = resp.url
                })
        })
}

function addRandomToDom(item){ //.id .name .cost
    let info_card = document.getElementById('random-list')
    info_card.querySelector('img').src = randomItem.url
    info_card.querySelector('img').alt = randomItem.name
    info_card.querySelector('b').textContent = randomItem.name
    info_card.querySelector('p').textContent = randomItem.examine
    info_card.querySelector('#cost').textContent = `Store Cost: ${randomItem.cost} gp`
    info_card.querySelector('#highalch').textContent = `High Alch Value: ${randomItem.highalch} gp`
    loadRandomItem()
}


function testRegistrationInputs(){
    const inputArray = Array.from(document.getElementsByClassName('register-input'))
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
    .then(userInfo => login(userInfo, inputs[0].value))
}

function login(userInfo, username){
    if (userInfo == 'no user with that username found' || userInfo == 'failure') {
        console.log('failed')
        return
    }
    $username = username
    addTrackedItems(userInfo)
const loggedOutFormsArray = Array.from(document.getElementsByClassName('logged-out'))
    loggedOutFormsArray.forEach(form => {
        form.classList.add('hidden')
    })
    changePage('Tracked Items')
    initializeNavbar()
}

function findUrl(item_id){
    return `https://www.ge-tracker.com/assets/images/icons/${item_id}.gif`
}

function addTrackedItems(items){
    console.log(items)
    let list = document.getElementById('tracked-list')
    items.forEach(item => {
        let url = `https://www.ge-tracker.com/assets/images/icons/${item.id}.gif`
        let div = document.createElement('div')
        div.innerHTML = `
        <div data-url=${item.wiki_url} class='tracked-item-card card'>
        <img data-url=${item.wiki_url} class='tracked-item-image' style='width:100%' alt='${item.name}' src=${url}>
        <h4 data-url=${item.wiki_url}><b class='tracked-item-name'>${item.name}</b></h4>
        <p data-url=${item.wiki_url} class='tracked-item-examine'>${item.examine}</p>
        <br>
        <p data-url=${item.wiki_url} class='tracked-item-costcost'>Store Price: ${item.cost} gp</p>
        <p data-url=${item.wiki_url} class='tracked-item-highalch'>High Alch Value: ${item.highalch} gp</p>
    </div>
        `
        list.appendChild(div)
    })

}

{/* <div class='info-card card'>
                <img id='random-item-image' style='width:100%' alt='random-item-image''>
                <h2><b id='random-item-name'></b></h2>
                <p id='random-item-examine'></p>
                <br>
                <p id='cost'></p>
                <p id='highalch'></p>
            </div> */}

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
        window.location.reload()
    }
}

function rejectInput(){
    console.log('failed')
}

function createEventListeners(){

    const signupButton = document.getElementById('signup-button')
    signupButton.addEventListener('click', (event) => {
        testRegistrationInputs()
    })

    const loginButton = document.getElementById('login-button')
    loginButton.addEventListener('click', (event) => {
        event.preventDefault()
        testLoginInputs()
    })

    const logoutButton = document.getElementById('logout')
    logoutButton.addEventListener('click', () => {
        event.preventDefault()
        window.location.reload()
    })

    document.getElementById('tracked-list').addEventListener('click', (event) => {
        window.open(event.target.dataset.url)
    })

    document.getElementById('searchbutton').addEventListener('click', () => {
            changePage('search-items')
    })
}