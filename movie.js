API_KEY = 'api_key=2a53060e7aeae49e00becfafc0cd1621';
const BASE_URL =  'https://api.themoviedb.org/3';
const API_URL =  BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMAGE_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_URL = BASE_URL + '/search/movie?' + API_KEY;

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2
var prevPage= 3;
var lastUrl ='';
var totalPages = 100;


getMovies(API_URL);

async function getMovies(url){
    lastUrl= url
    const res = await fetch(url);
    const data = await res.json();
    displayMovies(data.results);

    //console.log(data.results);

    currentPage = data.page;
    nextPage = currentPage + 1;
    prevPage= currentPage - 1;
    totalPages = data.total_pages;

    current.innerText = currentPage;
    if(currentPage <= 1){
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    }else if(currentPage >= totalPages){
        prev.classList.remove('disabled');
        next.classList.add('disabled');
    }else{
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
    }

    // tagEl.scrollIntoView({behavior : 'smooth'});
}

prev.addEventListener('click', ()=>{
    if(prevPage >0){
        pageCall(prevPage);
    }
});

next.addEventListener('click', ()=>{
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
});

function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = lastUrl[1].split('&');
    let key = queryParams[queryParams.length - 1]. split('=');
    
    if(key[0] != 'page'){
        let url = lastUrl + '&page=' + page;
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length - 1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b;
        getMovies(url);
    }
}

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const searchValue = search.value;
    if(searchValue && searchValue !== ''){
        getMovies(SEARCH_URL + '&query=' + searchValue);
        searchValue ='';
    }else{
        window.location.reload();
    }
});

function displayMovies(movies){
    main.innerHTML = '';
    movies.forEach((movie) => {
        const {title,poster_path,vote_average,overview, id} = movie;
        const moviesEl = document.createElement('div');
        moviesEl.classList.add('movie');
        moviesEl.innerHTML =`
            <img src= "${IMAGE_PATH + poster_path}" alt ="${title}"/>
            <div class = 'movie-info'>
                <h3> ${title}</h3>
                <span class = "${getClassesByRating(vote_average)}"> ${vote_average}</span>
                <div class = 'overview'>
                 <h3> Overview</h3>
                    ${overview}

                    </br>
                    <button class ="know-more"  id = "${id}">Know More</button>
                </div>
            </div>
        `

        main.appendChild(moviesEl);

        document.getElementById(id).addEventListener('click', ()=>{
            openNav(movie);
        });
    });
}

const overlayContent = document.getElementById('overlay-content')

/* Open when someone clicks on the span element */
function openNav(movie) {
    let id = movie.id;
    fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json())
    .then(videoData => {
        //  console.log(videoData);
        
        if(videoData){
            document.getElementById('myNav').style.width = "100%";
            if(videoData.results.length > 0){
                var embed = [];
                videoData.results.forEach(video => {
                    let {name, key, site} = video;
                    if(site = 'YouTube'){
                        embed.push(`
                            <iframe width="550" height="315" src="https://www.youtube.com/embed/${key}" 
                            title="${name}" class = "embed hide" frameborder="0" allow="accelerometer; 
                            autoplay; clipboard-write; encrypted-media; gyroscope; 
                            picture-in-picture" allowfullscreen></iframe>
                        `);
                    } 
                });

                
                overlayContent.innerHTML = embed.join('');
                activeSlide =0;
                showVideos();
            }else{
                overlayContent.innerHTML = `<h1 class = "no-result"> No result found</h1>`;
            }
        }
    });
}

 
  
/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
    document.getElementById("myNav").style.width = "0%";
} 


var activeSlide =0;
var totalVideos = 0;

function showVideos(){
    let embedClasses = document.querySelectorAll('.embed');
    totalVideos = embedClasses.length;
    embedClasses.forEach((embedTag, index)=>{    
        if(activeSlide == index){
            embedTag.classList.add('show');
            embedTag.classList.remove('hide');
        }else{
            embedTag.classList.add('hide');
            embedTag.classList.remove('show');
        }
    });
}

const leftArrow = document.getElementById('left-arrow');
const rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click', ()=>{
    if(activeSlide > 0){
        activeSlide--;
    }else{
        activeSlide = totalVideos - 1;
    }
    showVideos();
});

rightArrow.addEventListener('click', ()=>{
    if(activeSlide < (totalVideos - 1)){
        activeSlide++;
    }else{
        activeSlide = 0;
    }
    showVideos();
});


function getClassesByRating(rating){
    if(rating < 8){
        return 'green';
    }else if(rating >= 5){
        return 'orange';
    }else{
        return 'red';
    }
}


