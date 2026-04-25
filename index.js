import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch all projects
const projects = await fetchJSON('./lib/projects.json');

// Get first 3
const latestProjects = projects.slice(0, 3);

// Select container
const projectsContainer = document.querySelector('.projects');

// Render them
renderProjects(latestProjects, projectsContainer, 'h2');

// Fetch GitHub data
const githubData = await fetchGitHubData('alw054'); // your username

// Select container
const profileStats = document.querySelector('#profile-stats');

// Render data
if (profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
      <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
      <dt>Followers:</dt><dd>${githubData.followers}</dd>
      <dt>Following:</dt><dd>${githubData.following}</dd>
    </dl>
  `;
}