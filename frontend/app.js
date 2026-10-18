const API_URL = '/api/timetable';
let editId = null;

async function loadTimetable() {
  const res = await fetch(API_URL);
  const data = await res.json();
  const tbody = document.getElementById('timetableList');
  tbody.innerHTML = data.map(item => `
    <tr>
      <td>${item.id}</td>
      <td><b>${item.course_code}</b></td>
      <td>${item.course_name}</td>
      <td>${item.day_of_week}</td>
      <td>${item.start_time} - ${item.end_time}</td>
      <td>${item.venue}</td>
      <td>${item.goal}</td>
      <td>${item.status}</td>
      <td>
        <button onclick="editRecord(${item.id})">Edit</button>
        <button class="delete" onclick="deleteRecord(${item.id})">Delete</button>
      </td>
    </tr>
  `).join('');
}

document.getElementById('timetableForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    course_code: document.getElementById('course_code').value,
    course_name: document.getElementById('course_name').value,
    day_of_week: document.getElementById('day_of_week').value,
    start_time: document.getElementById('start_time').value,
    end_time: document.getElementById('end_time').value,
    venue: document.getElementById('venue').value,
    goal: document.getElementById('goal').value,
    status: document.getElementById('status').value,
  };

  const method = editId ? 'PUT' : 'POST';
  const url = editId ? `${API_URL}/${editId}` : API_URL;

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  resetForm();
  loadTimetable();
});

async function editRecord(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  document.getElementById('course_code').value = data.course_code;
  document.getElementById('course_name').value = data.course_name;
  document.getElementById('day_of_week').value = data.day_of_week;
  document.getElementById('start_time').value = data.start_time;
  document.getElementById('end_time').value = data.end_time;
  document.getElementById('venue').value = data.venue;
  document.getElementById('goal').value = data.goal;
  document.getElementById('status').value = data.status;
  editId = id;
  document.getElementById('submitBtn').innerText = 'Update';
  window.scrollTo(0,0);
}

async function deleteRecord(id) {
  if (!confirm('Delete this record?')) return;
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadTimetable();
}

function resetForm() {
  editId = null;
  document.getElementById('timetableForm').reset();
  document.getElementById('submitBtn').innerText = 'Add';
}

loadTimetable();