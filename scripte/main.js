let currentPokemon;
let responseAsJson;
let newPokeCard;
let newPokeCardHeader;
let pokeList;
let foundPokeNames = [];



async function loadMonster(firstID, lastID) {
    showLoadingScreen()
    for (let i = firstID; i <= lastID; i++) {
        await getFromAPI(i)
        renderNewCard(i);
        renderLoadingCircle(firstID, i);
    }
    showPokedex(lastID)
}

async function getFromAPI(i) {
    if (i == 0 || i == 1011) { return }
    else {
        let url = 'https://pokeapi.co/api/v2/pokemon/' + i;
        let response = await fetch(url);
        responseAsJson = await response.json();
        currentPokemon = capitalizeFirstLetter(responseAsJson.name);
        monsterNameCheck()
    }
}

function monsterNameCheck() {
    let id = responseAsJson.id
    id == 29 ? currentPokemon = 'Nidoran♀' :
        id == 32 ? currentPokemon = 'Nidoran♂' :
            id == 122 ? currentPokemon = 'Mr. Mime' :
                id == 866 ? currentPokemon = 'Mr. Rime' :
                    currentPokemon;
}

function renderNewCard(i) {
    makeNewPokeCard(i)

    makePokeCardHeader()

    getPokeCardImg()

    monsterHeadInfo()
}

function makeNewPokeCard(i) {
    let parentElement = document.getElementById('Pokedex')
    newPokeCard = document.createElement('div')

    newPokeCard.id = 'Card' + i;
    newPokeCard.classList.add('PokeCard');
    newPokeCard.addEventListener("click", function () {
        toggleBigCard(i)
    });

    parentElement.appendChild(newPokeCard)
}

function makePokeCardHeader() {
    newPokeCardHeader = document.createElement('div')
    newPokeCardHeader.classList.add(responseAsJson.types[0].type.name);
    newPokeCardHeader.classList.add('Poke_card_header');
    newPokeCard.appendChild(newPokeCardHeader)
}

function getPokeCardImg() {
    let pokeImage = document.createElement('img');
    pokeImage.classList.add('Poke_Image');
    pokeImage.src = responseAsJson.sprites.other["official-artwork"].front_default;

    newPokeCardHeader.appendChild(pokeImage)
}

function monsterHeadInfo() {
    newPokeCardHeader.innerHTML += /*html*/`
    <h3>${currentPokemon}</h3> <br>
    `;
    newPokeCardHeader.innerHTML += getPokemonNumber()
}

function getPokemonNumber() {
    let pokeNumber = [responseAsJson.id]
    if (pokeNumber < 10) { return '#00' + pokeNumber }
    if (pokeNumber < 100) { return '#0' + pokeNumber }
    else { return '#' + pokeNumber }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function loadListForSearch() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=1010&offset=0';
    let response = await fetch(url);
    let veryBigList = await response.json();
    pokeList = veryBigList.results
}

function findPokemon() {
    let target = document.getElementById('monsterInput').value
    if (Number(target) <= 1010 && Number(target) > 0) { searchPokeNumber(target) } else {
        target = target.toLowerCase()
        for (let i in pokeList) {
            let pokeName = pokeList[i].name
            if (pokeName.includes(target)) {
                foundPokeNames.push(Number(i) + 1)
            }
        }
        if (foundPokeNames.length > 0) { showFoundPokemon() }
        else { alert('Sorry, no Pokémon found. Please try again.') }
    }
}

async function searchPokeNumber(i) {
    deletePokedex()
    await getFromAPI(i)
    renderNewCard(i);

}

async function showFoundPokemon() {
    deletePokedex()
    showLoadingScreen()
    for (let j in foundPokeNames) {
        await getFromAPI(foundPokeNames[j])
        monsterAmount = foundPokeNames.length;
        renderLoadingCircle(foundPokeNames[0], foundPokeNames[j]);
        renderNewCard(foundPokeNames[j]);
    }
    LoadMoreButton('none')
    showPokedex()
    foundPokeNames = []
}


