import createRatingStars from "./starts";
document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsContainer = document.getElementById("results");
  const loading = document.getElementById("loading");

  loading.innerHTML = `<div><img src="./assets/loading-4x-gray._CB485916919_.gif" alt=""></div>`;
  const url = `https://amazon-scraper-3bnr.onrender.com/api/scrape?keyword=${encodeURIComponent(keyword)}`
  //To run localy coments the url above end use the url bellow
  // const url = `http://localhost:3000/api/scrape?keyword=headset${encodeURIComponent(keyword)}`
  try { 
    const res = await fetch(url);
    const data = await res.json();

    if(data){
      loading.innerHTML = ""   
    }

    resultsContainer.innerHTML = data
      .map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p id="rating">Rating:<span> ${product.rating.split(" ")[0]}<span/>${createRatingStars(product.rating)}</p>
          <p id="reviews">Reviews: ${product.reviews}</p>
        </div>
      `)
      .join("");
  } catch (err) {
    resultsContainer.innerHTML = `<p class="error">Failed to fetch data: ${err.message}</p>`;
  }
});

document.getElementById("keyword").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    document.getElementById("searchBtn").click();
  }
});
