<?php
/**
 * POST login - Route: /login.php
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
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
    sendJson(['success' => false, 'message' => 'Username and password required']);
    exit;
}

$users = loadJson('users.json');
foreach ($users as $user) {
    if (($user['username'] ?? '') === $username && ($user['password'] ?? '') === $password) {
        $response = $user;
        unset($response['password']);
        sendJson(['success' => true, 'message' => 'Login successful', 'user' => $response]);
        exit;
    }
}

sendJson(['success' => false, 'message' => 'Invalid username or password'], 401);
