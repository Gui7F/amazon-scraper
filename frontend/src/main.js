document.getElementById("searchBtn").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;
  const resultsContainer = document.getElementById("results");

  resultsContainer.innerHTML = "Loading...";

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    const data = await res.json();

    if (data.error) throw new Error(data.error);

    resultsContainer.innerHTML = data
      .map(product => `
        <div class="product-card">
          <img src="${product.image}" alt="${product.title}" />
          <h3>${product.title}</h3>
          <p>Rating: ${product.rating}</p>
          <p>Reviews: ${product.reviews}</p>
        </div>
      `)
      .join("");
  } catch (err) {
    resultsContainer.innerHTML = `<p class="error">Failed to fetch data: ${err.message}</p>`;
  }
});

