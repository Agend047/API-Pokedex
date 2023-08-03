let progressBarArray = document.querySelectorAll('.Progress');
let progressBar = progressBarArray[0];

let radius = progressBar.r.baseVal.value;
let circumference = radius * 2 * Math.PI; //Umfang berechnen
progressBarArray[0].style.strokeDasharray = circumference;
progressBarArray[1].style.strokeDasharray = circumference;

let monsterAmount;
let firstID_ArrayGEN = [1, 152, 252, 387, 495, 650, 722, 810, 906];
let lastID_ArrayGEN = [151, 251, 386, 494, 649, 721, 809, 905, 1010];
let lastLoadedMonster;


function showLoadingScreen() {
    let loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = "flex";

    let pokedex = document.getElementById('Pokedex')
    pokedex.style.display = 'none';
}

function deletePokedex() {
    document.getElementById('Pokedex').innerHTML = '';
}

function renderLoadingCircle(firstID, monsterIndex) {
    monsterIndex = Number(monsterIndex) - Number(firstID);
    let percent = (100 / monsterAmount) * (monsterIndex + 1)
    progressBarArray[0].style.strokeDashoffset = circumference - (percent / 100) * circumference;
    progressBarArray[1].style.strokeDashoffset = circumference - (percent / 100) * circumference;
}

function showPokedex(lastID) {
    let loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.display = "none";

    let pokedex = document.getElementById('Pokedex')
    pokedex.style.display = 'flex';

    if (lastID) {
        LoadMoreButton('flex')
        lastLoadedMonster = lastID;
    }
}

function LoadMoreButton(now) {
    let lowerLoadButton = document.getElementById('Lower_Load_Button')
    lowerLoadButton.style.display = now;
}

function loadSomeFromGen(G) {
    deletePokedex()
    G = G - 1
    monsterAmount = 30;
    lastLoadedMonster = firstID_ArrayGEN[G] + 30
    loadMonster(firstID_ArrayGEN[G], lastLoadedMonster)
}

function loadMoreMonster() {
    monsterAmount = 30;
    loadMonster(lastLoadedMonster + 1, lastLoadedMonster + 30)
}

function loadRestOfGen() {
    for (let i in lastID_ArrayGEN) {
        if (lastID_ArrayGEN[i] > lastLoadedMonster) {
            monsterAmount = lastID_ArrayGEN[i] - lastLoadedMonster;
            loadMonster(lastLoadedMonster + 1, lastID_ArrayGEN[i]);
            lastLoadedMonster = lastID_ArrayGEN[i];
            break
        }
    }
}