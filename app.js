let allPokemon = [];
let tableauFin = [];
const searchInput = document.querySelector('.recherche-poke input');
const listePoke = document.querySelector('.liste-poke');
const chargement = document.querySelector('.loader');

const types = {
    grass: '#78c850',
	ground: '#E2BF65',
	dragon: '#6F35FC',
	fire: '#F58271',
	electric: '#F7D02C',
	fairy: '#D685AD',
	poison: '#966DA3',
	bug: '#B3F594',
	water: '#6390F0',
	normal: '#D9D5D8',
	psychic: '#F95587',
	flying: '#A98FF3',
	fighting: '#C25956',
    rock: '#B6A136',
    ghost: '#735797',
    ice: '#96D9D6'
};

function fetchPokemonBase() {

    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
        .then(reponse => reponse.json())
        .then((allPoke) => {
            
            allPoke.results.forEach((pokemon) => {
                fetchPokemonComplet(pokemon);
            })

        })
}

fetchPokemonBase();


function fetchPokemonComplet(pokemon) {
    // Pour récupérer toutes les info des 151 pokemons
    let objPokemonFull = {};
    let url = pokemon.url;
    let nameP = pokemon.name;

    fetch(url)
        .then(reponse => reponse.json())
        .then((pokeData => {
            objPokemonFull.pic = pokeData.sprites.front_default;
            objPokemonFull.type = pokeData.types[0].type.name;
            objPokemonFull.id = pokeData.id;

            fetch(`https://pokeapi.co/api/v2/pokemon-species/${nameP}`)
                .then(reponse => reponse.json())
                .then((pokeData) => {
                    objPokemonFull.name = pokeData.names[4].name;
                    allPokemon.push(objPokemonFull);

                    // Pour que les pokemons soient dans l'ordre
                    if(allPokemon.length === 151) {
                        tableauFin = allPokemon.sort((a,b) => {
                            return a.id - b.id;
                        }).slice(0, 21);

                        createCard(tableauFin);
                        chargement.style.display = 'none';
                    }
                })
        })
    )
}


// Création des cartes

function createCard(arr) {
    for(let i = 0; i < arr.length; i++) {

        const carte = document.createElement('li');
        let couleur = types[arr[i].type];
        carte.style.background = couleur;

        const txtCarte = document.createElement('h5');
        txtCarte.innerText = arr[i].name;

        const idCarte = document.createElement('p');
        idCarte.innerText = `ID#${arr[i].id}`;

        const imgCarte = document.createElement('img');
        imgCarte.src = arr[i].pic;

        carte.appendChild(imgCarte);
        carte.appendChild(txtCarte);
        carte.appendChild(idCarte);

        listePoke.appendChild(carte);
    }
}

// Scrool infini

window.addEventListener('scroll', () => {

    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    // scrollTop = scroll depuis le top
    // scrollHeight = scroll total
    // clientHeight = hauteur de la fenetre, partie visible
    
    if (clientHeight + scrollTop >= scrollHeight - 20){
        addPoke(6);
    }
})

let index = 21;

function addPoke(nb)  {
    if(index > 151) {
        return;
    }
    // Ajoute les 6 prochains pokemon au tableau
    const arrToAdd = allPokemon.slice(index, index + nb);
    createCard(arrToAdd);
    // Pour qu'ils soient tous à la suite
    // index s'actualise à chaque appel de fonction addPoke (+6)
    index += nb;
}

// Recherche


//Pour utiliser le bouton rechercher
// const formRecherche = document.querySelector('form');
// formRecherche.addEventListener('submit', (e) => {
    //     e.preventDefault();
    //     recherche();
    // })
    
searchInput.addEventListener('keyup', recherche);

function recherche() {
    // Tous les pokemon doivent être chargés sur la page pour les rechercher
    if(index < 151) {
        addPoke(130);
    }

    let filter, allLi, titleValue, allTitles;
    filter = searchInput.value.toUpperCase(); // Notre recherche en majuscule
    allLi = document.querySelectorAll('li'); // Cible tous les li
    allTitles = document.querySelectorAll('li > h5'); // Cible tous les noms de pokemon

    for (i = 0; i < allLi.length; i++) {

        titleValue = allTitles[i].innerText; // Représente le nom du pokemon qui passe dans la boucle

        // On compare le nom du pokemon avec la recherche
        if (titleValue.toUpperCase().indexOf(filter) > -1) {
            allLi[i].style.display = "flex";
        } else {
            allLi[i].style.display = "none";
        }
    }
}

// Animation Input 
searchInput.addEventListener('input', function(e) {

    // Si on est en train d'écrire dans input donc différent de ""
    if(e.target.value != "") {
        // On rajoute la classe active-input au formulaire
       e.target.parentNode.classList.add('active-input');
       // Sinon, on si il y a qqchose dans input
    } else if (e.target.value === "") {
        // On l'enlève
        e.target.parentNode.classList.remove('active-input');
    }

})