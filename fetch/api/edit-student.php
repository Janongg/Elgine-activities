<?php
/**
 * PUT edit-student - Route: /edit-student.php
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/includes/helpers.php';

// Support both PUT and POST methods for compatibility
if ($_SERVER['REQUEST_METHOD'] !== 'PUT' && $_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['success' => false, 'message' => 'Method not allowed'], 405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$id = isset($input['id']) ? (int) $input['id'] : null;
$studentId = trim($input['student_id'] ?? '');

if ($id === null && $studentId === '') {
    sendJson(['success' => false, 'message' => 'id or student_id is required'], 400);
    exit;
}

$students = loadJson('students.json');
$found = false;
$studentIndex = null;

// Find the student to edit
foreach ($students as $index => $student) {
    $match = false;
    if ($id !== null && (int) ($student['id'] ?? 0) === $id) {
        $match = true;
    } elseif ($studentId !== '' && ($student['student_id'] ?? '') === $studentId) {
        $match = true;
    }
    
    if ($match) {
        $studentIndex = $index;
        $found = true;
        break;
    }
}

if (!$found) {
    sendJson(['success' => false, 'message' => 'Student not found'], 404);
    exit;
}

// Get existing student data
$existingStudent = $students[$studentIndex];

// Update fields if provided
$firstName = trim($input['first_name'] ?? '');
$lastName = trim($input['last_name'] ?? '');
$email = trim($input['email'] ?? '');
$course = trim($input['course'] ?? '');
$yearLevel = isset($input['year_level']) ? (int) $input['year_level'] : null;
$newStudentId = trim($input['new_student_id'] ?? '');

// Validate required fields if updating
if ($firstName === '' && $lastName === '' && $email === '' && $course === '' && $yearLevel === null && $newStudentId === '') {
    sendJson(['success' => false, 'message' => 'At least one field must be provided for update'], 400);
    exit;
}

// Check if new student_id conflicts with existing students (excluding current student)
if ($newStudentId !== '') {
    foreach ($students as $index => $student) {
        if ($index !== $studentIndex && ($student['student_id'] ?? '') === $newStudentId) {
            sendJson(['success' => false, 'message' => 'Student ID already exists'], 409);
            exit;
        }
    }
    $existingStudent['student_id'] = $newStudentId;
}

// Check if new email conflicts with existing students (excluding current student)
if ($email !== '') {
    foreach ($students as $index => $student) {
        if ($index !== $studentIndex && ($student['email'] ?? '') === $email) {
            sendJson(['success' => false, 'message' => 'Email already exists'], 409);
            exit;
        }
    }
    $existingStudent['email'] = $email;
}

// Update other fields
if ($firstName !== '') {
    $existingStudent['first_name'] = $firstName;
}
if ($lastName !== '') {
    $existingStudent['last_name'] = $lastName;
}
if ($course !== '') {
    $existingStudent['course'] = $course;
}
if ($yearLevel !== null) {
    $existingStudent['year_level'] = $yearLevel;
}

$students[$studentIndex] = $existingStudent;

if (!saveJson('students.json', $students)) {
    sendJson(['success' => false, 'message' => 'Failed to update student'], 500);
    exit;
}

sendJson(['success' => true, 'message' => 'Student updated successfully', 'student' => $existingStudent]);
