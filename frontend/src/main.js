import createRatingStars from "./starts";
document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsContainer = document.getElementById("results");
  const loading = document.getElementById("loading");

  loading.innerHTML = `<div><img src="./public/assets/loading-4x-gray._CB485916919_.gif" alt=""></div>`;
  
  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
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
