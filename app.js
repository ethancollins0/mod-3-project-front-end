const registrationUrl = 'http://localhost:5000/register'
const loginUrl = 'http://localhost:5000/login'
const randomUrl = 'http://localhost:5000/item/random'
const priceUrl = 'http://localhost:5000/item/price/'
const updateUrl = 'http://localhost:5000/item/update'
const deleteUrl = 'http://localhost:5000/item/delete'
const saveUrl = 'http://localhost:5000/item/save'
let toggle = true

let randomItem = {url: '', name: '', cost: 0, highalch: 0, examine: '', db_id: 0}
let currentPage = 'tracked-items'
let $username = ''

document.addEventListener('DOMContentLoaded', () => {
    logoutPage()
    createEventListeners()
    loadRandomItem()
    addRandomToDom()
    attemptLogin([{value: 'username'}, {value: 'password'}])
    addTrackedItems()
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
            randomItem.url = item.image_url

            let randomImages = document.getElementById('random-list').querySelectorAll('img')

            toggle == true
                ? randomImages[0].src = item.image_url
                : randomImages[1].src = item.image_url

            randomItem.name = item.name
            randomItem.cost = item.cost
            randomItem.examine = item.examine
            randomItem.highalch = item.highalch
            randomItem.id = item.id
        })
}

function addRandomToDom(){ //.id .name .cost
    let info_card = document.getElementById('random-list')
    let randomImages = document.getElementById('random-list').querySelectorAll('img')

    if (toggle == true){
        randomImages[1].style.display = 'none'
        randomImages[0].style.display = 'block'
    } else {
        randomImages[0].style.display = 'none'
        randomImages[1].style.display = 'block'
    }

    toggle == true
    ? toggle = false
    : toggle = true
    
    info_card.querySelector('b').textContent = randomItem.name
    info_card.querySelector('p').textContent = randomItem.examine
    info_card.querySelector('#cost').textContent = `Store Cost: ${randomItem.cost} gp`
    info_card.querySelector('#highalch').textContent = `High Alch Value: ${randomItem.highalch} gp`
    info_card.querySelector('button').dataset['id'] = randomItem.id
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

function saveItem(id){
    let username = $username
    let item_id = id
    fetch(saveUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            id: item_id
        })
    }).then(resp => resp.json())
    .then((item) => {
        let array = []
        array.push(item)
        addTrackedItems(array)
    })
    .then(() => {
        loadRandomItem()
        addRandomToDom()
    })
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
const loggedOutFormsArray = Array.from(document.getElementsByClassName('logged-out'))
    loggedOutFormsArray.forEach(form => {
        form.classList.add('hidden')
    })
    changePage('Tracked Items')
    initializeNavbar()
    addTrackedItems(userInfo)
}

function addTrackedItems(items){
    let list = document.getElementById('tracked-list')
    let divArray = []
items.forEach(item => {
        let div = document.createElement('div')
        div.classList = 'tracked-item-card card'
        div.dataset['url'] = item.wiki_url
        div.innerHTML = `<img data-url=${item.wiki_url} class='tracked-item-image' style='width:100%' alt='${item.name}' src='${item.image_url}'>
        <h2 data-url=${item.wiki_url}><b class='tracked-item-name'>${item.name}</b></h2>
        <p data-url=${item.wiki_url} class='tracked-item-examine'>${item.examine}</p>
        <br>
        <p data-url=${item.wiki_url} class='tracked-item-cost'>Store Price: ${item.cost} gp</p>
        <p data-url=${item.wiki_url} class='tracked-item-highalch'>Highalch Value: ${item.highalch} gp</p>
        <p data-url=${item.wiki_url} class='tracked-item-current-price'>GE Price: ${item.updated_price} gp</p>
        <button data-itemid=${item.db_id} class='update-button'>Update GE Price</button>
        <button data-itemid=${item.db_id} class='delete-button'>Stop Tracking</button>
        `
        list.appendChild(div)
        divArray.push(div)
    })    
}

// function updateTrackedItemPrices(items, divArray){
//     items.forEach((item, index) => {
//             fetch(priceUrl, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({name: item.name, num: index})
//             }).then(resp => resp.json())
//             .then(price => {
//                 divArray[index].querySelector('.tracked-item-current-price').textContent = `GE Price: ${price} gp`
//                 console.log(`updated ${item.name} with ge price: ${price}`)
//             })
//     })
// }

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

    document.getElementById('tracked-list').addEventListener('click' ,(event) => {
        if (event.target != document.getElementById('tracked-list')){
            if (event.target.classList != 'delete-button' && event.target.classList != ('update-button')){
                window.open(event.target.dataset.url)
            }
        }
    })

    document.getElementById('tracked-list').addEventListener('click', (event) => {
        if (event.target.classList == 'delete-button'){
            fetch(deleteUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "db_id": event.target.dataset.itemid,
                    "username": $username
                })
            }).then(resp => resp.json())
            .then(() => {
                console.log(event.target.parentNode.remove())
            })
        }
    })

    document.getElementById('tracked-list').addEventListener('click', (event) => {
        if (event.target.classList == 'update-button'){
            fetch(updateUrl, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    "db_id": event.target.dataset.itemid
                })
            }).then(resp => resp.json())
            .then(json => event.target.parentNode.querySelector('.tracked-item-current-price').textContent = `GE Price: ${json.updated_price} gp`)
        }
    })

    document.getElementById('searchbutton').addEventListener('click', () => {
            changePage('search-items')
    })

    document.getElementById('random-list').querySelector('button').addEventListener('click', (event) => {
        event.preventDefault()
        saveItem(event.target.dataset.id)
    })
}