const apiKey = "5bfbfac022d543f88f61ec7650f30c7b";
const newsContainer = document.getElementById('news-container');
const categorySelect = document.getElementById('category-select');
const paginationContainer = document.getElementById('pagination');
const mainHeading = document.createElement('h1');
const defaultImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRS3zZyF4QIxijJ-DZyVf1uxirTAmp-exPI_ZulyyQ7Fw&s';

let currentPage = 1;
const pageSize = 6;

const getNewsByCategory = async (category, page) => {
  const url = `https://newsapi.org/v2/top-headlines?apiKey=${apiKey}&category=${category}&language=en&pageSize=${pageSize}&page=${page}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const articles = data.articles;

    // Update main heading
    mainHeading.textContent = category ? `Top Headlines from ${category.toUpperCase()} Category` : 'Top Headlines';
    document.querySelector('main').insertBefore(mainHeading, newsContainer);

    newsContainer.innerHTML = ''; // Clear previous content before adding new
    articles.forEach(article => {
      createNewsCard(article);
    });
    createPagination(data.totalResults);
  } catch (error) {
    console.error(error);
    newsContainer.innerHTML = 'Failed to load news';
  }
};

const createNewsCard = (article) => {
  const card = document.createElement('a');
  card.classList.add('news-card');
  card.href = article.url;
  card.target = '_blank';
  card.innerHTML = `
    <img src="${article.urlToImage || defaultImageUrl}" alt="${article.title}" onerror="this.src='${defaultImageUrl}'">
    <h3>${article.title}</h3>
    <p>${article.description || article.content}</p>
  `;
  newsContainer.appendChild(card);
};

const createPagination = (totalResults) => {
  const totalPages = Math.ceil(totalResults / pageSize);
  paginationContainer.innerHTML = '';
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.textContent = i;
    button.addEventListener('click', () => {
      currentPage = i;
      getNewsByCategory(categorySelect.value, currentPage);
    });
    if (i === currentPage) {
      button.classList.add('active');
    }
    paginationContainer.appendChild(button);
  }
};

categorySelect.addEventListener('change', (event) => {
  currentPage = 1;
  const selectedCategory = event.target.value;
  getNewsByCategory(selectedCategory, currentPage);
});

getNewsByCategory('', currentPage); 