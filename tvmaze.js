"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let res = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  console.log()
  return res.data
  

 
}
/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  //let test = JSON.parse(shows)
  let $show;
  for (let show of shows) {
    if(show.show.image == null){
       $show = $(
      `<div data-show-id="${show.show.name}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="https://tinyurl.com/tv-missing"
              alt="${show.show.name}"
              ">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button id="Show-getEpisodes-${show.show.id}"class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);
    }
    else {
       $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
           <div class="media">
             <img
                src="${show.show.image.medium}"
                alt="${show.show.name}"
                class="w-25 me-3">
             <div class="media-body">
               <h5 class="text-primary">${show.show.name}</h5>
               <div><small>${show.show.summary}</small></div>
               <button id="Show-getEpisodes-${show.show.id}" class="btn btn-outline-light btn-sm Show-getEpisodes">
                 Episodes
               </button>
             </div>
           </div>
         </div>
        `);
    }
      $show.find(".Show-getEpisodes").on("click", async function () {
        //$episodesArea.empty();
        $episodesArea.show()
        $showsList.hide()
        $searchForm.hide();
        const episodes = await getEpisodesOfShow(show.show.id);

        populateEpisodes(episodes);
        
      })
      console.log(show.show.name)
    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */
const $episodeBtn = $(".Show-getEpisodes")
 async function getEpisodesOfShow(id) { 
    const res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes?specials=${id}`)
    return res.data
 }

/** Write a clear docstring for this function... */

 function populateEpisodes(episodes) { 
  const $ul = $('#episodesList');
  for (let episode of episodes){
    const $li = $(`
  <li> 
    <img src="${episode.image.medium}"class="w-25 me-3"></img>
    <h5 class="text-primary">${episode.name}</h5>
    <div> Season ${episode.season} Episode ${episode.number}</div>
    <div> <small> ${episode.summary}</small></div>
  </li>`)
    $ul.append($li)
  }
  
}
const $episodeList = $('#episodesList');
const $backBtn = $('#goBack');

$backBtn.on('click',function(e){
  e.preventDefault();
  $episodesArea.hide();
  $episodeList.empty();
  $showsList.show();
  $searchForm.show();

})

/*$episodeBtn.on("click", async function(e){
  e.preventDefault();
  const id = $episodeBtn.parents().attr('data-show-id')
  console.log(id)
})*/
