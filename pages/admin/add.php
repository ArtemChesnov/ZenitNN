<?php
require_once __DIR__ . '/auth.php';

if ($_POST['csrf_token'] !== ($_SESSION['csrf'] ?? '')) {
  http_response_code(403);
  exit('Неверный CSRF токен');
}

$jsonFile = __DIR__ . '/../../data/news.json';
$galleryBasePath = __DIR__ . '/../../img/gallery/';
$newsPagesPath = __DIR__ . '/../../pages/news-posts/';
$templatePath = __DIR__ . '/../../pages/admin/template.html';

// Допустимые форматы
$allowedExts = ['jpg', 'jpeg', 'png', 'webp'];
$allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
$finfo = new finfo(FILEINFO_MIME_TYPE);

// Получение данных
$title = $_POST['title'] ?? '';
$text = $_POST['text'] ?? '';

if (!$title || !$text) {
  http_response_code(400);
  echo "Title and text required";
  exit;
}

// Загрузка текущих новостей
$news = file_exists($jsonFile) ? json_decode(file_get_contents($jsonFile), true) : [];
$id = uniqid();

// Создание папок
$newsFolder = $galleryBasePath . $id;
$coverFolder = "$newsFolder/cover";
$photosFolder = "$newsFolder/photos";
mkdir($coverFolder, 0777, true);
mkdir($photosFolder, 0777, true);

// Обработка обложки
$coverRelativePath = '';
if (isset($_FILES['cover']) && $_FILES['cover']['error'] === UPLOAD_ERR_OK) {
  $coverExt = pathinfo($_FILES['cover']['name'], PATHINFO_EXTENSION);
  $coverMime = $finfo->file($_FILES['cover']['tmp_name']);

  if (
    !in_array(strtolower($coverExt), $allowedExts) ||
    !in_array($coverMime, $allowedMimeTypes)
  ) {
    http_response_code(400);
    exit("Неподдерживаемый формат файла обложки");
  }

  $coverFileName = "cover.$coverExt";
  $coverFilePath = "$coverFolder/$coverFileName";
  move_uploaded_file($_FILES['cover']['tmp_name'], $coverFilePath);
  $coverRelativePath = "/img/gallery/$id/cover/$coverFileName";
}

// Обработка изображений
$photoRelativePaths = [];
if (!empty($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
  foreach ($_FILES['images']['tmp_name'] as $i => $tmp) {
    if ($_FILES['images']['error'][$i] === UPLOAD_ERR_OK) {
      $ext = pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION);
      $mime = $finfo->file($tmp);

      if (
        !in_array(strtolower($ext), $allowedExts) ||
        !in_array($mime, $allowedMimeTypes)
      ) {
        http_response_code(400);
        exit("Неподдерживаемый формат изображения: {$_FILES['images']['name'][$i]}");
      }

      $fileName = "photo_$i.$ext";
      move_uploaded_file($tmp, "$photosFolder/$fileName");
      $photoRelativePaths[] = "/img/gallery/$id/photos/$fileName";
    }
  }
}


if ($_FILES['cover']['error'] !== UPLOAD_ERR_OK) {
  http_response_code(500);
  exit("Ошибка при загрузке файла: код " . $_FILES['cover']['error']);
}

// Добавление новости в JSON
$news[] = [
  'id' => $id,
  'title' => $title,
  'text' => $text,
  'cover' => $coverRelativePath,
  'photos' => $photoRelativePaths
];
file_put_contents($jsonFile, json_encode($news, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Генерация страницы
if (!file_exists($templatePath)) {
  http_response_code(500);
  echo "Template not found";
  exit;
}

$template = file_get_contents($templatePath);
$pageContent = str_replace(
  ['{{title}}', '{{text}}', '{{id}}'],
  [htmlspecialchars($title, ENT_QUOTES), nl2br(htmlspecialchars($text, ENT_QUOTES)), $id],
  $template
);
file_put_contents($newsPagesPath . "$id.html", $pageContent);

if (!file_put_contents($newsPagesPath . "$id.html", $pageContent)) {
  http_response_code(500);
  exit("Ошибка записи HTML страницы");
}

require_once __DIR__ . '/../generate-sitemap.php';

http_response_code(200);
echo "Success";
