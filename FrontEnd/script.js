// @ts-nocheck

// Loading jobs and categories
const works = await fetch("http://localhost:5678/api/works");
const worksResponse = await works.json();
console.log(worksResponse);

const categories = await fetch("http://localhost:5678/api/categories");
const categoriesResponse = await categories.json();
console.log(categoriesResponse);
