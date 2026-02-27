<?php
/**
 * API info - lists available routes (each route is a separate PHP file)
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'message' => 'Simple PHP API',
    'routes' => [
        'POST login' => '/login.php',
        'GET student-list' => '/student-list.php',
        'POST student-information' => '/student-information.php',
    ],
], JSON_PRETTY_PRINT);
