<?php
// ❗ Защита от прямого обращения с браузера
if ($_SERVER['HTTP_X_REQUESTED_WITH'] !== 'XMLHttpRequest') {
    http_response_code(403);
    exit('Access denied');
}

// Заголовок для JSON
header('Content-Type: application/json');

// Путь до файла
$newsFile = __DIR__ . '/news.json';

// Проверка на существование
if (!file_exists($newsFile)) {
    http_response_code(404);
    echo json_encode(['error' => 'Not found']);
    exit;
}

// Возвращаем содержимое
echo file_get_contents($newsFile);
