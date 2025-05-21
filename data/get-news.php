<?php
if ($_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
    http_response_code(403);
    exit('Access denied');
}

header('Content-Type: application/json');

$newsFile = __DIR__ . '/news.json';

if (!file_exists($newsFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

$json = file_get_contents($newsFile);

json_decode($json);
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON in news.json']);
    exit;
}

echo $json;
exit;
