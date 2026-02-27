<?php
/**
 * DELETE student-delete - Route: /student-delete.php
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/includes/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    sendJson(['success' => false, 'message' => 'Method not allowed'], 405);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_GET;
$id = isset($input['id']) ? (int) $input['id'] : null;
$studentId = trim($input['student_id'] ?? '');

if ($id === null && $studentId === '') {
    sendJson(['success' => false, 'message' => 'id or student_id is required'], 400);
    exit;
}

$students = loadJson('students.json');
$found = false;
$deletedStudent = null;

foreach ($students as $index => $student) {
    $match = false;
    if ($id !== null && (int) ($student['id'] ?? 0) === $id) {
        $match = true;
    } elseif ($studentId !== '' && ($student['student_id'] ?? '') === $studentId) {
        $match = true;
    }
    
    if ($match) {
        $deletedStudent = $student;
        unset($students[$index]);
        $found = true;
        break;
    }
}

if (!$found) {
    sendJson(['success' => false, 'message' => 'Student not found'], 404);
    exit;
}

// Re-index array to maintain sequential indices
$students = array_values($students);

if (!saveJson('students.json', $students)) {
    sendJson(['success' => false, 'message' => 'Failed to delete student'], 500);
    exit;
}

sendJson(['success' => true, 'message' => 'Student deleted successfully', 'student' => $deletedStudent]);
