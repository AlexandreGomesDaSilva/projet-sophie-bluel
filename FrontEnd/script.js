// @ts-nocheck

// Loading jobs and categories
const works = await fetch("http://localhost:5678/api/works");
const worksResponse = await works.json();
console.log(worksResponse);

const categories = await fetch("http://localhost:5678/api/categories");
const categoriesResponse = await categories.json();
console.log(categoriesResponse);

// Function to display jobs
const displayWorks = (works) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = works
    .map((work) => {
      return `<figure>
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
      </figure>`;
    })
    .join("");
};

// Display all jobs
displayWorks(worksResponse);
