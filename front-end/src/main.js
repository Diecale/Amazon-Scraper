document.getElementById("searchButton").addEventListener("click", async () => {
  const keyword = document.getElementById("keyword").value;

  if (!keyword) {
    alert("Please enter a keyword");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await response.json();

    // Get the results container and add "Search Results" text
    const resultsContainer = document.getElementById("results-container");
    const resultsDiv = document.getElementById("results");
    const resultDivText = document.getElementById("results-text");

    // Update result text
    resultDivText.textContent = `Results for "${keyword}": `;

    // Clear previous results
    resultsDiv.innerHTML = "";

    // Display results
    data.forEach((product) => {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product-card");

      productDiv.innerHTML = `
      <h2>${product.title}</h2>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <p><strong>Reviews:</strong> ${product.reviews}</p>
      <img src="${product.imageUrl}" alt="${product.title}"/>
      `;
      resultsDiv.appendChild(productDiv);
    });
  } catch (error) {
    console.log(error);
    alert("Error fetching data. Please check the console.");
  }
});
