console.log('IT’S ALIVE!');

// Helper function
function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Pages data
let pages = [
  { url: "", title: "Home" },
  { url: "projects/", title: "Projects" },
  { url: "contact/", title: "Contact" },
  { url: "https://github.com/alw054", title: "GitHub" },
  { url: "resume/", title: "Resume" }

];



// Detect base path (local vs GitHub Pages)
const BASE_PATH =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";

// Create nav and add to page
let nav = document.createElement("nav");
document.body.prepend(nav);

// Create links
for (let p of pages) {
  let url = p.url;

  // Fix relative URLs
  url = !url.startsWith("http") ? BASE_PATH + url : url;

  let a = document.createElement("a");
  a.href = url;
  a.textContent = p.title;

  // Highlight current page
  a.classList.toggle(
    "current",
    a.host === location.host && a.pathname === location.pathname
  );

  // Open external links in new tab
  if (a.host !== location.host) {
    a.target = "_blank";
  }

  nav.append(a);
}

// Add theme switcher UI
document.body.insertAdjacentHTML(
  "afterbegin",
  `
  <label class="color-scheme">
    Theme:
    <select>
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>
`
);

// Get the select element
let select = document.querySelector(".color-scheme select");

// Function to apply theme
function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty("color-scheme", colorScheme);
  select.value = colorScheme;
}

// Load saved preference
if ("colorScheme" in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

// Listen for changes
select.addEventListener("input", (event) => {
  let value = event.target.value;

  setColorScheme(value);

  // Save preference
  localStorage.colorScheme = value;
});

let form = document.querySelector("form");

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  let data = new FormData(form);
  let url = form.action + "?";
  let params = [];

  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`);
  }

  url += params.join("&");
  location.href = url;
});

export async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Safety check
  if (!containerElement) {
    console.error('Invalid container element');
    return;
  }

  // Clear existing content
  containerElement.innerHTML = '';

  // Validate heading level
  const validHeadings = ['h1','h2','h3','h4','h5','h6'];
  if (!validHeadings.includes(headingLevel)) {
    headingLevel = 'h2';
  }

  // Loop through projects
  for (let project of projects) {
    const article = document.createElement('article');

    // Handle missing data safely
    const title = project.title || 'Untitled Project';
    const image = project.image || '';
    const description = project.description || '';

    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      ${image ? `<img src="${image}" alt="${title}">` : ''}
      <p>${description}</p>
    `;

    containerElement.appendChild(article);
  }
}

export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}