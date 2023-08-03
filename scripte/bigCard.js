let speciesAsJson;
let oldBigOneType;
let newBigOneType;

async function toggleBigCard(i) {
    await getFromAPI(i)
    await getSpeciesAPI(i)
    newBigOneType = responseAsJson.types[0].type.name
    showBigCard()
    fillCardHeader()
    fillInfoContainer('txt', 0)
    makeSideButtons(i)
}

async function getSpeciesAPI(i) {
    let url = 'https://pokeapi.co/api/v2/pokemon-species/' + i;
    let response = await fetch(url);
    speciesAsJson = await response.json();
    monsterNameCheck()
}

function showBigCard() {
    let bigCardSection = document.getElementById('BC_Whole_Section')
    bigCardSection.classList.remove('DisplayNone')
    bigCardSection.style.display = 'flex'
    let shaderDiv = document.getElementById('shaderDiv')
    shaderDiv.classList.remove('DisplayNone')
    let closeButton = document.getElementById('BC_CloseButton')
    closeButton.classList.add(responseAsJson.types[0].type.name)
}

function fillCardHeader() {
    document.getElementById('BC_PokeName').innerHTML = currentPokemon;
    document.getElementById('BC_Number').innerHTML = getPokemonNumber();
    document.getElementById('Big_Card_Header').classList.add(responseAsJson.types[0].type.name)
    document.getElementById('BC_Poke_Img').src = responseAsJson.sprites.other["official-artwork"].front_default;
    createTypes()
}

function createTypes() {
    let typesDiv = document.getElementById('BC_PokeTypes');
    typesDiv.innerHTML = '';
    let types = responseAsJson.types;
    for (i in types) {
        let typeButton = document.createElement('button');
        let type = types[i].type.name;
        typeButton.innerText = type.toUpperCase()
        typeButton.classList.add('Type_Button')
        typeButton.classList.add(type)

        typesDiv.appendChild(typeButton)
    }
}

async function fillInfoContainer(wichOne, oldOrNew) {
    resetButtonColor(oldOrNew)
    let infoArea = document.getElementById('BC_Info_Box')
    infoArea.innerHTML = '';

    if (wichOne == 'txt') {
        showInfo(infoArea)
    }
    if (wichOne == 'over') {
        showOverview(infoArea)
    }
    if (wichOne == 'stats') {
        showStats(infoArea)
    }
    giveButtonColor(wichOne)
}

function resetButtonColor(oldOrNew) {
    let type;
    oldOrNew > 1 ? type = oldBigOneType : type = newBigOneType;

    let buttons = document.querySelectorAll('.BC_Buttons');
    for (let i = 0; i <= 2; i++) {
        buttons[i].classList.remove(type)
        buttons[i].classList.remove('ColorWhite')
    }
}

function giveButtonColor(wichOne) {
    let button = document.getElementById('BC_info_' + wichOne)
    let type = newBigOneType;

    button.classList.add(type)
    button.classList.add('ColorWhite')
}

function showInfo(infoArea) {

    let infoDIV = document.createElement('div')
    infoDIV.classList.add('BC_info-text')
    let textContainers = speciesAsJson.flavor_text_entries
    for (let i in textContainers) {
        if (speciesAsJson.flavor_text_entries[i].language.name == "en") {
            infoDIV.innerHTML = speciesAsJson.flavor_text_entries[i].flavor_text
            break
        }
    }
    infoArea.appendChild(infoDIV)
}

function showOverview(infoArea) {
    let infos = ['Color:', 'Egg-Group:', 'Height:', 'Weight:', 'Ability:']
    for (let i in infos) {

        let newSpan = document.createElement('span');
        let newP1 = document.createElement('p');
        let newP2 = document.createElement('p');

        newSpan.classList.add('BC_over_span');
        newP1.innerHTML = infos[i];
        newP2.innerHTML = loadOverInfo(i);
        infoArea.appendChild(newSpan);
        newSpan.appendChild(newP1);
        newSpan.appendChild(newP2);
    }
}

function loadOverInfo(i) {
    let functions = [getColor, eggGroup, getHeight, getWeight, getAbilitys]
    return functions[i]()
}

function getColor() {
    return capitalizeFirstLetter(speciesAsJson.color.name)
}

function eggGroup() {
    let eggGroups = speciesAsJson.egg_groups
    let result = '';
    for (let i = 0; i < eggGroups.length; i++) {
        result += capitalizeFirstLetter(eggGroups[i].name)
        if (i < eggGroups.length - 1) {
            result += ', '
        }
    }
    return result
}

function getHeight() {
    let baseHeight = responseAsJson.height;
    let correctHeight = baseHeight * 0.1
    return correctHeight.toFixed(1) + " m"
}

function getWeight() {
    let baseWeight = responseAsJson.weight;
    let correctWeight = baseWeight * 0.1
    return correctWeight.toFixed(1) + " kg"
}

function getAbilitys() {
    let abilities = responseAsJson.abilities;
    let result = '';
    for (let i = 0; i < abilities.length; i++) {
        result += capitalizeFirstLetter(abilities[i].ability.name);
        if (i < abilities.length - 1) {
            result += ', ';
        }
    }
    return result;
}

function showStats(infoArea) {
    infoArea.innerHTML = /*html*/`
        <canvas id="statDiagram"></canvas>
        `
    const ctx = document.getElementById('statDiagram');;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'Attack', 'Defence', 'Special-Attack', 'Special-Defence', 'Speed'],
            datasets: [{
                data: getStatData(),
                backgroundColor: ['red', 'rgb(240, 128, 48)', 'rgb(248, 208, 48)', 'rgb(104, 144, 240)', 'rgb(120, 200, 80)', 'rgb(248, 88, 136)'],
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false //removing the 'label' tag above the diagram!
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

function getStatData() {
    let result = []
    for (let i in responseAsJson.stats) {
        result.push(responseAsJson.stats[i].base_stat)
    }
    return result
}

function makeSideButtons(i) {
    let leftSideButton = document.getElementById('BC_sideButton_left')
    let rightSideButton = document.getElementById('BC_sideButton_rigth')

    giveEventListener(leftSideButton, rightSideButton, i)
    displaySideButtons(leftSideButton, rightSideButton, i)
    fillSideButtons(i)
}

function giveEventListener(leftSideButton, rightSideButton, i) {
    leftSideButton.onclick = function () {
        nextPokemon(i - 1);
    }
    rightSideButton.onclick = function () {
        nextPokemon(Number(i) + Number(1));
    }
}

async function nextPokemon(newi) {
    oldBigOneType = newBigOneType
    resetButtonColor()
    await toggleBigCard(newi)
    if (oldBigOneType != newBigOneType) {
        removeTypes(oldBigOneType)
    }
}

function displaySideButtons(leftSideButton, rightSideButton, i) {
    let width = document.getElementById('BC_Whole_Section').offsetWidth
    if (i == 1 || width < 600) {
        leftSideButton.style.display = 'none';
    } else {
        leftSideButton.style.display = 'block';
    }

    if (i == 1010 || width < 600) {
        rightSideButton.style.display = 'none';
    } else {
        rightSideButton.style.display = 'block';
    }
}

async function fillSideButtons(i) {
    i = Number(i)
    let leftImage = document.getElementById('BC_SB_left_image')
    await getFromAPI(i - 1)
    leftImage.src = responseAsJson.sprites.other["official-artwork"].front_default;


    let rightImage = document.getElementById('BC_SB_right_image')
    await getFromAPI(Number(i + 1))
    rightImage.src = responseAsJson.sprites.other["official-artwork"].front_default;
}

function closeBigCard() {
    resetButtonColor()

    let bigCardSection = document.getElementById('BC_Whole_Section')
    bigCardSection.classList.toggle('DisplayNone')
    bigCardSection.style.display = 'none'

    let shaderDiv = document.getElementById('shaderDiv')
    shaderDiv.classList.add('DisplayNone')

    removeTypes(newBigOneType)
}

function removeTypes(type) {
    document.getElementById('Big_Card_Header').classList.remove(type)

    let closeButton = document.getElementById('BC_CloseButton')
    closeButton.classList.remove(type)
    resetButtonColor(oldBigOneType)
}