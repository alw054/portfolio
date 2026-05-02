import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const titleElement = document.querySelector('.projects-title');
const searchInput = document.querySelector('.searchBar');

let query = '';
let selectedYear = null;

titleElement.textContent = `Projects (${projects.length})`;

function getFilteredProjects() {
  let filtered = projects;

  if (query) {
    filtered = filtered.filter((project) => {
      let values = `${project.title} ${project.description} ${project.year}`.toLowerCase();
      return values.includes(query.toLowerCase());
    });
  }

  if (selectedYear) {
    filtered = filtered.filter((project) => project.year === selectedYear);
  }

  return filtered;
}

function updatePage() {
  const filteredProjects = getFilteredProjects();

  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);

  titleElement.textContent = `Projects (${filteredProjects.length})`;
}

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year
  );

  let data = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  let arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(50);

  let sliceGenerator = d3.pie()
    .value((d) => d.value);

  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('*').remove();

  arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .attr('class', data[i].label === selectedYear ? 'selected' : '')
      .on('click', () => {
        selectedYear = selectedYear === data[i].label ? null : data[i].label;
        updatePage();
      });
  });

  let legend = d3.select('.legend');
  legend.selectAll('*').remove();

  data.forEach((d, i) => {
    legend.append('li')
      .attr('style', `--color:${colors(i)}`)
      .attr('class', d.label === selectedYear ? 'selected' : '')
      .html(`
        <span class="swatch"></span>
        ${d.label} <em>(${d.value})</em>
      `)
      .on('click', () => {
        selectedYear = selectedYear === d.label ? null : d.label;
        updatePage();
      });
  });
}

searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  updatePage();
});

updatePage();