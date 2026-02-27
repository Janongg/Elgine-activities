// Student data
const students = [
  { name: "Ana", scores: [85, 90, 88], present: true },
  { name: "Ben", scores: [70, 75, 72], present: false },
  { name: "Cara", scores: [95, 92, 94], present: true },
  { name: "Daniel", scores: [60, 65, 70], present: true },
  { name: "Ella", scores: [88, 85, 90], present: true },
  { name: "Felix", scores: [78, 80, 82], present: false },
  { name: "Grace", scores: [92, 89, 94], present: true },
  { name: "Hannah", scores: [73, 70, 68], present: false },
  { name: "Ivan", scores: [81, 84, 79], present: true },
  { name: "Julia", scores: [96, 98, 97], present: true }
];

function calculateAverage(scores) {
  const sum = scores.reduce((acc, score) => acc + score, 0); // plus na amin
  return (sum / scores.length).toFixed(2); // mano nga grade
}

function isPassed(average) {
  return average >= 75;
}

function renderStudents(studentsToRender = students) {  // alan na jay student array
  const tableBody = document.getElementById('studentTable');
  tableBody.innerHTML = ''; 

  studentsToRender.forEach(student => { // kasla bagbagaan na nga ubraen amin jy baba every student list
    const average = calculateAverage(student.scores); 
    const passed = isPassed(average);
    
    const row = document.createElement('tr');// garamid table row kasla memory
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.scores[0]}</td>
      <td>${student.scores[1]}</td>
      <td>${student.scores[2]}</td>
      <td>${average}</td>
      <td>
        <span class="status-badge ${passed ? 'status-passed' : 'status-failed'}">
          ${passed ? 'Passed' : 'Failed'}
        </span>
        ${student.present ? '' : '<span class="status-badge status-absent">Absent</span>'}
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Search students by name
function searchStudents() {
  const input = document.getElementById('searchInput').value.toLowerCase();
  
  if (input === '') {
    renderStudents(students);
    return;
  }

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(input)
  );
  
  renderStudents(filteredStudents);
}

// Filter students based on criteria
function filterStudents(filterType) {
  let filteredStudents = [];

  switch(filterType) {
    case 'present':
      filteredStudents = students.filter(student => student.present);
      break;
    case 'absent':
      filteredStudents = students.filter(student => !student.present);
      break;
    case 'passed':
      filteredStudents = students.filter(student => {
        const avg = calculateAverage(student.scores);
        return isPassed(avg);
      });
      break;
    case 'failed':
      filteredStudents = students.filter(student => {
        const avg = calculateAverage(student.scores);
        return !isPassed(avg);
      });
      break;
    default:
      filteredStudents = students;
  }

  renderStudents(filteredStudents);
}

// Allow search on Enter key
document.addEventListener('DOMContentLoaded', function() {
  // Initial render
  renderStudents();

  // 
  document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchStudents();
    }
  });
});
