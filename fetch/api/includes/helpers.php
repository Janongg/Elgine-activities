<?php
/**
 * Shared helpers for the API
 */

define('DATA_DIR', dirname(__DIR__) . '/data');

function sendJson(array $data, int $code = 200): void
{
    http_response_code($code);
    echo json_encode($data, JSON_PRETTY_PRINT);
}

function loadJson(string $file): array
{
    $path = DATA_DIR . '/' . $file;
    if (!is_file($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function saveJson(string $file, array $data): bool
{
    $path = DATA_DIR . '/' . $file;
    return file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT)) !== false;
}
