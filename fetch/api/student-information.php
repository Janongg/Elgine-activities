<?php
/**
 * POST student-information - Route: /student-information.php
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson(['success' => false, 'message' => 'Method not allowed'], 405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
$studentId = trim($input['student_id'] ?? '');
$firstName = trim($input['first_name'] ?? '');
$lastName = trim($input['last_name'] ?? '');
$email = trim($input['email'] ?? '');
$course = trim($input['course'] ?? '');
$yearLevel = (int) ($input['year_level'] ?? 1);

if ($studentId === '' || $firstName === '' || $lastName === '' || $email === '') {
    sendJson(['success' => false, 'message' => 'student_id, first_name, last_name, and email are required']);
    exit;
}

$students = loadJson('students.json');
$maxId = 0;
foreach ($students as $s) {
    $id = (int) ($s['id'] ?? 0);
    if ($id > $maxId) $maxId = $id;
}

$newStudent = [
    'id' => $maxId + 1,
    'student_id' => $studentId,
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => $email,
    'course' => $course ?: 'N/A',
    'year_level' => $yearLevel,
    'enrollment_date' => date('Y-m-d'),
];
$students[] = $newStudent;

if (!saveJson('students.json', $students)) {
    sendJson(['success' => false, 'message' => 'Failed to save student'], 500);
    exit;
}

sendJson(['success' => true, 'message' => 'Student added successfully', 'student' => $newStudent], 201);
