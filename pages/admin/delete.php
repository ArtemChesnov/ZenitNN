<?php
require_once __DIR__ . '/auth.php';

// Проверка ID и метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST' || !isset($_POST['id'])) {
    http_response_code(400);
    echo "Missing or invalid request";
    exit;
}

$id = $_POST['id'];
$newsFile = __DIR__ . '/../../data/news.json';
$newsPage = __DIR__ . "/../../pages/news-posts/$id.html";
$imageDir = __DIR__ . "/../../img/gallery/$id/";

// Проверяем наличие файла
if (!file_exists($newsFile)) {
    http_response_code(500);
    echo "news.json not found";
    exit;
}

// Загружаем и фильтруем JSON
$newsData = json_decode(file_get_contents($newsFile), true);
$filteredNews = array_filter($newsData, fn($n) => $n['id'] !== $id);

// Если новость не найдена
if (count($newsData) === count($filteredNews)) {
    http_response_code(404);
    echo "News not found";
    exit;
}

// Обновляем JSON
file_put_contents($newsFile, json_encode(array_values($filteredNews), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

// Удаляем HTML-страницу
if (file_exists($newsPage)) {
    unlink($newsPage);
}

// Рекурсивное удаление папки
function deleteFolder($folder)
{
    if (!is_dir($folder))
        return;
    $items = scandir($folder);
    foreach ($items as $item) {
        if ($item === '.' || $item === '..')
            continue;
        $path = $folder . DIRECTORY_SEPARATOR . $item;
        is_dir($path) ? deleteFolder($path) : unlink($path);
    }
    rmdir($folder);
}

deleteFolder($imageDir);

echo "Deleted successfully";
