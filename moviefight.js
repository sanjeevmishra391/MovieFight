// fetching search results. API call
async function getSelectedMovie(value) {
  const res = await axios.get("https://www.omdbapi.com/", {
    params : {
      apikey: '1ea2c0af',
      i: value
    }
  });
  return res.data;
}

//-----------------------------------------------------------------------------

const autoCompleteConfig = {
  renderOption(movie) {
    const imgSrc = movie.Poster === 'N/A' ? " " : movie.Poster;
    return `<img src='${imgSrc}'> ${movie.Title} (${movie.Year})`;
  },
  inputValue(movie) {
    return movie.Title;
  },
  async fetchData(value) {
    const res = await axios.get("https://www.omdbapi.com/", {
      params : {
        apikey: '1ea2c0af',
        s: value
      }
    });
    if(res.data.Response==="True") {
      return res.data.Search;
    } else {
      return [];
    }
  }
};

let leftMovie;
let rightMovie;
createAutoComplete( {
  root: document.querySelector("#left-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    const tut = document.querySelector(".tutorial");
    tut.classList.add("d-none");
    onSelect(document.querySelector(".left-summary"), movie, "left");
  }
} );

createAutoComplete( {
  root: document.querySelector("#right-autocomplete"),
  ...autoCompleteConfig,
  onOptionSelect(movie) {
    const tut = document.querySelector(".tutorial");
    tut.classList.add("d-none");
    onSelect(document.querySelector(".right-summary"), movie, "right");
  }
} );

//-----------------------------------------------------------------------------

//function to handle clicks on anchor tags
const onSelect = async (summaryRoot, movieSelected, side) => {
  const movie = await getSelectedMovie(movieSelected.imdbID);
  movieTemplate(summaryRoot, movie);

  if(side==="left") {
    leftMovie = movie;
  } else {
    rightMovie = movie;
  }

  if(leftMovie && rightMovie) {
    runComparision();
  }
}

const runComparision = () => {
  const leftStats = document.querySelectorAll(".left-summary .list-group-item");
  const rightStats =  document.querySelectorAll(".right-summary .list-group-item");

  leftStats.forEach((leftstat, ind) => {
    const rightstat = rightStats[ind];

    const leftValue = parseInt(leftstat.dataset.value);
    const rightValue = parseInt(rightstat.dataset.value);

    if(leftValue>rightValue) {
      leftstat.style.backgroundColor = "#ffc8dd";
      rightstat.style.backgroundColor = "#bde0fe";
    } else {
      rightstat.style.backgroundColor = "#ffc8dd";
      leftstat.style.backgroundColor = "#bde0fe";
    }
  });

}

const movieTemplate = (summaryRoot, movie) => {

  let count=0;
  const genre = movie.Genre.split(" ").forEach((word) => {
    count++;
  });

  const dollars = parseInt(movie.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const imdb = parseFloat(movie.imdbRating);
  const metaScore = parseInt(movie.Metascore);
  const runtime = parseInt(movie.Runtime);


  summaryRoot.innerHTML = `
  <div class="card mb-3" style="max-width: 450px;">
    <div class="row no-gutters">
      <div class="col-md-4">
        <img src="" class="card-img" alt="Movie Poster">
      </div>
      <div class="col-md-8">
          <div class="card-body">
            <h4 class="card-title"></h4>
            <p class="card-text"></p>
          </div>
      </div>
    </div>
    <hr style="margin: 0px;">
    <ul class="list-group list-group-flush detail-ul">
    </ul>
  </div>
  `;

  const img = document.querySelector(`.${summaryRoot.classList[0]} .card-img`);
  const title = document.querySelector(`.${summaryRoot.classList[0]} .card-title`);
  const plot = document.querySelector(`.${summaryRoot.classList[0]} .card-text`);
  const detailUl = document.querySelector(`.${summaryRoot.classList[0]} .detail-ul`);

  img.setAttribute("src", movie.Poster);
  title.innerHTML = `${movie.Title} (${movie.Year})`;
  plot.innerHTML = movie.Plot;
  while(detailUl.hasChildNodes()) {
    detailUl.removeChild(detailUl.childNodes[0]);
  }
  addDetail("Genre", movie.Genre, detailUl, count);
  addDetail("Box Office", movie.BoxOffice, detailUl, dollars);
  addDetail("IMDB Rating", movie.imdbRating, detailUl, imdb);
  addDetail("Meta Score", movie.Metascore, detailUl, metaScore);
  addDetail("Runtime", movie.Runtime, detailUl, runtime);
}

const addDetail = (title, content, parent, dvalue) => {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  li.setAttribute("data-value", dvalue);
  parent.appendChild(li);
  li.innerHTML = `<b>${title}</b>: <span style="text-align: right;">${content}</span>`;
}
