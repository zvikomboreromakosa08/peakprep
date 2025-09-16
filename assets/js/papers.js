fetch('assets/data/past-papers.json')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('papersList');
    const searchInput = document.getElementById('searchInput');
    const subjectFilter = document.getElementById('subjectFilter');
    const yearFilter = document.getElementById('yearFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');

    // Populate filters
    const subjects = [...new Set(data.map(p => p.subject))];
    subjects.forEach(s => subjectFilter.innerHTML += `<option>${s}</option>`);
    const years = [...new Set(data.map(p => p.year))].sort((a,b)=>b-a);
    years.forEach(y => yearFilter.innerHTML += `<option>${y}</option>`);

    function render() {
      const q = searchInput.value.toLowerCase();
      const subj = subjectFilter.value;
      const yr = yearFilter.value;
      const diff = difficultyFilter.value;

      list.innerHTML = '';
      data.filter(p => 
        (!q || p.title.toLowerCase().includes(q)) &&
        (!subj || p.subject === subj) &&
        (!yr || p.year == yr) &&
        (!diff || p.difficulty === diff)
      ).forEach(p => {
        list.innerHTML += `<div>
          <a href="view-paper.html?id=${p.id}">${p.title}</a> 
          (${p.year} - ${p.subject} - ${p.difficulty})
        </div>`;
      });
    }

    searchInput.oninput = render;
    subjectFilter.onchange = render;
    yearFilter.onchange = render;
    difficultyFilter.onchange = render;

    render();
  });
