const API_BASE = 'http://localhost/fetch/api';
let allStudents    = [];
let editingStudentId = null;
let deletingStudent  = null;

// ── HELPERS ──
const AVATAR_COLORS = ['#d4552b','#2b6cd4','#2d8a4e','#8b45b5','#c4941a','#b54573'];

function colorForName(name) {
  let hash = 0;
  for (let c of (name||'')) hash = c.charCodeAt(0) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initials(name) {
  return (name||'?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function escHtml(str) {
  return String(str||'')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fullName(s) {
  return ((s.first_name||'') + ' ' + (s.last_name||'')).trim() || s.name || 'Unknown';
}

function yearLabel(y) {
  const labels = { 1:'1st Year', 2:'2nd Year', 3:'3rd Year', 4:'4th Year' };
  return labels[y] || y;
}

// ── TOAST ──
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  t.className = `toast ${type} show`;
  setTimeout(() => t.classList.remove('show'), 3500);
}

// ── LOGIN ──
async function doLogin() {
  const btn      = document.getElementById('loginBtn');
  const errEl    = document.getElementById('errorMsg');
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  errEl.classList.remove('show');
  if (!username || !password) {
    errEl.textContent = 'Please enter both username and password.';
    errEl.classList.add('show');
    return;
  }

  btn.textContent = 'Signing in...';
  btn.classList.add('loading');

  try {
    const res  = await fetch(`${API_BASE}/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.success) {
      const user        = data.user || {};
      const displayName = user.name || user.username || username;
      document.getElementById('userName').textContent    = displayName;
      document.getElementById('userAvatar').textContent  = initials(displayName);
      document.getElementById('userAvatar').style.background = colorForName(displayName);
      document.getElementById('login-page').style.display     = 'none';
      document.getElementById('dashboard-page').style.display = 'block';
      loadStudents();
    } else {
      errEl.textContent = data.message || 'Invalid credentials.';
      errEl.classList.add('show');
    }
  } catch (e) {
    errEl.textContent = 'Could not connect to the server. Make sure the API is running at ' + API_BASE;
    errEl.classList.add('show');
  }

  btn.textContent = 'Sign In';
  btn.classList.remove('loading');
}

// ── LOAD STUDENTS ──
async function loadStudents() {
  try {
    const res  = await fetch(`${API_BASE}/student-list.php`);
    const data = await res.json();
    if (data.success) {
      allStudents = data.students || [];
      renderStats(allStudents);
      renderTable(allStudents);
      document.getElementById('dashSubtitle').textContent =
        `Showing ${allStudents.length} student${allStudents.length !== 1 ? 's' : ''} in the system.`;
    } else {
      showTableError('Failed to load students: ' + (data.message || 'Unknown error'));
    }
  } catch (e) {
    showTableError('Could not fetch student data from the server.');
  }
}

// ── STATS ──
function renderStats(students) {
  const courses    = new Set(students.map(s => s.course).filter(Boolean));
  const latestYear = students.reduce((max, s) => Math.max(max, parseInt(s.year_level)||0), 0);
  document.getElementById('statTotal').textContent   = students.length;
  document.getElementById('statCourses').textContent = courses.size || '—';
  document.getElementById('statBatch').textContent   = latestYear ? yearLabel(latestYear) : '—';
}

// ── RENDER TABLE ──
function renderTable(students) {
  const tbody = document.getElementById('studentTableBody');
  if (!students.length) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="icon">🎓</div>No students found.</div></td></tr>`;
    return;
  }
  tbody.innerHTML = students.map(s => {
    const name      = fullName(s);
    const color     = colorForName(name);
    const studentId = escHtml(s.student_id || s.id || '—');
    const email     = escHtml(s.email   || '—');
    const course    = escHtml(s.course  || '—');
    const year      = escHtml(yearLabel(s.year_level) || '—');
    const sid       = escHtml(s.student_id || '');
    return `
      <tr>
        <td style="color:var(--muted);font-size:0.82rem;font-weight:600">${studentId}</td>
        <td>
          <div class="student-name">
            <div class="student-avatar" style="background:${color}">${initials(name)}</div>
            ${escHtml(name)}
          </div>
        </td>
        <td style="color:var(--muted)">${email}</td>
        <td><span class="badge badge-grade">${course}</span></td>
        <td style="text-align:center">${year}</td>
        <td>
          <div style="display:flex;gap:0.5rem;justify-content:center">
            <button class="btn-edit"   onclick="openEditModal('${sid}')">✏️ Edit</button>
            <button class="btn-delete" onclick="openConfirm('${sid}')">🗑️ Delete</button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

// ── SEARCH ──
function filterStudents() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allStudents.filter(s => JSON.stringify(s).toLowerCase().includes(q));
  renderTable(filtered);
}

function showTableError(msg) {
  document.getElementById('studentTableBody').innerHTML =
    `<tr class="loading-row"><td colspan="6" style="color:var(--accent)">${msg}</td></tr>`;
}

// ── FORM VALIDATION HELPERS ──
function clearForm() {
  ['f_student_id','f_first_name','f_last_name','f_email','f_course'].forEach(id => {
    document.getElementById(id).value = '';
    document.getElementById(id).classList.remove('invalid');
  });
  document.getElementById('f_year_level').value = '1';
  ['err_student_id','err_first_name','err_last_name','err_email'].forEach(id => {
    const el = document.getElementById(id);
    el.textContent = '';
    el.classList.remove('show');
  });
}

function setFieldError(fieldId, errId, msg) {
  document.getElementById(fieldId).classList.add('invalid');
  const err = document.getElementById(errId);
  err.textContent = msg;
  err.classList.add('show');
}

function clearFieldError(fieldId, errId) {
  document.getElementById(fieldId).classList.remove('invalid');
  const err = document.getElementById(errId);
  err.textContent = '';
  err.classList.remove('show');
}

// ── ADD MODAL ──
function openAddModal() {
  editingStudentId = null;
  document.getElementById('modalTitle').textContent  = 'Add Student';
  document.getElementById('f_student_id').disabled   = false;
  clearForm();
  document.getElementById('modalOverlay').classList.add('open');
}

// ── EDIT MODAL ──
function openEditModal(studentId) {
  const s = allStudents.find(x => (x.student_id||'') === studentId);
  if (!s) return;
  editingStudentId = studentId;
  document.getElementById('modalTitle').textContent  = 'Edit Student';
  document.getElementById('f_student_id').value      = s.student_id  || '';
  document.getElementById('f_student_id').disabled   = true;
  document.getElementById('f_first_name').value      = s.first_name  || '';
  document.getElementById('f_last_name').value       = s.last_name   || '';
  document.getElementById('f_email').value           = s.email       || '';
  document.getElementById('f_course').value          = s.course      || '';
  document.getElementById('f_year_level').value      = s.year_level  || '1';
  ['err_student_id','err_first_name','err_last_name','err_email'].forEach(id => {
    document.getElementById(id).textContent = '';
    document.getElementById(id).classList.remove('show');
  });
  document.getElementById('modalOverlay').classList.add('open');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('f_student_id').disabled = false;
}

// ── SAVE (Add or Edit) ──
async function saveStudent() {
  const student_id = document.getElementById('f_student_id').value.trim();
  const first_name = document.getElementById('f_first_name').value.trim();
  const last_name  = document.getElementById('f_last_name').value.trim();
  const email      = document.getElementById('f_email').value.trim();
  const course     = document.getElementById('f_course').value.trim();
  const year_level = parseInt(document.getElementById('f_year_level').value);

  // Validate
  let valid = true;
  if (!student_id && !editingStudentId) {
    setFieldError('f_student_id','err_student_id','Student ID is required.'); valid = false;
  } else clearFieldError('f_student_id','err_student_id');
  if (!first_name) {
    setFieldError('f_first_name','err_first_name','First name is required.'); valid = false;
  } else clearFieldError('f_first_name','err_first_name');
  if (!last_name) {
    setFieldError('f_last_name','err_last_name','Last name is required.'); valid = false;
  } else clearFieldError('f_last_name','err_last_name');
  if (!email) {
    setFieldError('f_email','err_email','Email is required.'); valid = false;
  } else clearFieldError('f_email','err_email');
  if (!valid) return;

  const saveBtn = document.getElementById('saveBtn');
  saveBtn.textContent = 'Saving...';
  saveBtn.disabled    = true;

  try {
    let res, data;
    if (editingStudentId) {
      // EDIT
      res  = await fetch(`${API_BASE}/edit-student.php`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: editingStudentId, first_name, last_name, email, course, year_level })
      });
      data = await res.json();
      if (data.success) {
        showToast('Student updated successfully!');
        closeModal();
        await loadStudents();
      } else {
        showToast(data.message || 'Failed to update student.', 'error');
      }
    } else {
      // ADD
      res  = await fetch(`${API_BASE}/student-add.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id, first_name, last_name, email, course, year_level })
      });
      data = await res.json();
      if (data.success) {
        showToast('Student added successfully!');
        closeModal();
        await loadStudents();
      } else {
        if (data.message && data.message.toLowerCase().includes('student id')) {
          setFieldError('f_student_id','err_student_id', data.message);
        } else if (data.message && data.message.toLowerCase().includes('email')) {
          setFieldError('f_email','err_email', data.message);
        } else {
          showToast(data.message || 'Failed to add student.', 'error');
        }
      }
    }
  } catch (e) {
    showToast('Could not connect to the server.', 'error');
  }

  saveBtn.textContent = 'Save Student';
  saveBtn.disabled    = false;
}

// ── DELETE ──
function openConfirm(studentId) {
  const s = allStudents.find(x => (x.student_id||'') === studentId);
  if (!s) return;
  deletingStudent = s;
  document.getElementById('confirmMsg').textContent =
    `You are about to delete "${fullName(s)}". This cannot be undone.`;
  document.getElementById('confirmOverlay').classList.add('open');
}

function closeConfirm() {
  document.getElementById('confirmOverlay').classList.remove('open');
}

async function confirmDelete() {
  if (!deletingStudent) return;
  const btn = document.getElementById('confirmDeleteBtn');
  btn.textContent = 'Deleting...';
  btn.disabled    = true;

  try {
    const res  = await fetch(`${API_BASE}/student-delete.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: deletingStudent.id, student_id: deletingStudent.student_id })
    });
    const data = await res.json();
    if (data.success) {
      const name = fullName(deletingStudent);
      closeConfirm();
      showToast(`${name} has been deleted.`);
      deletingStudent = null;
      await loadStudents();
    } else {
      showToast(data.message || 'Failed to delete student.', 'error');
    }
  } catch (e) {
    showToast('Could not connect to the server.', 'error');
  }

  btn.textContent = 'Yes, Delete';
  btn.disabled    = false;
}

// ── LOGOUT ──
function doLogout() {
  document.getElementById('dashboard-page').style.display = 'none';
  document.getElementById('login-page').style.display     = 'grid';
  document.getElementById('password').value               = '';
  document.getElementById('searchInput').value            = '';
  allStudents = [];
}

// ── INIT AFTER DOM READY ──
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('modalOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('confirmOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeConfirm();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-page').style.display !== 'none') doLogin();
  });
});
