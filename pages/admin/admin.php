<?php
session_start();

// Настройки
$timeout = 900; // 15 минут
$config = require 'config.php';

// Проверка активности сессии
if (isset($_SESSION['LAST_ACTIVITY']) && time() - $_SESSION['LAST_ACTIVITY'] > $timeout) {
    session_unset();
    session_destroy();
    header("Location: admin");
    exit;
}
$_SESSION['LAST_ACTIVITY'] = time();

// Обработка выхода
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['logout'])) {
    session_destroy();
    header("Location: admin");
    exit;
}

// Обработка входа
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'], $_POST['password'])) {
    $login = trim($_POST['login']);
    $password = $_POST['password'];

    if ($login === '' || $password === '') {
        $login_error = "Пожалуйста, заполните все поля.";
    } elseif ($login === $config['admin_login'] && password_verify($password, $config['admin_hash'])) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        header("Location: admin");
        exit;
    } else {
        $login_error = "Неверный логин или пароль.";
    }
}
?>
<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8" />
    <title>Админка</title>
    <link rel="stylesheet" href="/css/style.css" />
</head>

<body class="page admin-page">
    <?php if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true): ?>
        <div class="admin-login">
            <form method="POST" class="admin-login__form">
                <h1 class="admin-login__title">Авторизация</h1>
                <?php if (!empty($login_error)): ?>
                    <div class="admin-login__error"><?= htmlspecialchars($login_error) ?></div>
                <?php endif; ?>
                <input class="admin-login__input-name<?= !empty($login_error) ? ' error' : '' ?>" type="text" name="login"
                    placeholder="Логин" required />
                <input class="admin-login__input-password<?= !empty($login_error) ? ' error' : '' ?>" type="password"
                    name="password" placeholder="Пароль" required />
                <button class="admin-login__input-button" type="submit">Войти</button>
            </form>
        </div>
    <?php else: ?>
        <div class="admin-panel">
            <a href="?logout=1" class="admin-panel__logout">Выйти</a>
            <h1 class="admin-panel__title">Добавить статью</h1>

            <form id="upload-form" enctype="multipart/form-data" class="admin-panel__form">
                <input type="hidden" name="csrf_token" value="<?= htmlspecialchars($_SESSION['csrf']) ?>" />

                <label for="title" class="admin-panel__form-label">Заголовок</label>
                <input class="admin-panel__form-input" type="text" id="title" name="title" required />

                <label for="text" class="admin-panel__form-label">Текст новости</label>
                <textarea class="admin-panel__form-textarea" id="text" name="text" rows="5" required></textarea>

                <label for="coverInput" class="admin-panel__form-label">Обложка</label>
                <div class="admin-panel__form-dropzone-wrapper">
                    <div class="admin-panel__form-dropzone" id="coverZone">
                        Перетащите обложку или нажмите для выбора
                        <input type="file" name="cover" id="coverInput" class="admin-panel__form-file" required />
                    </div>
                </div>
                <div id="coverPreviewWrapper">
                    <img id="coverPreview" class="admin-panel__form-cover-preview" style="display: none" />
                </div>

                <label for="imagesInput" class="admin-panel__form-label">Фотографии</label>
                <div class="admin-panel__form-dropzone-wrapper">
                    <div class="admin-panel__form-dropzone" id="dropZone">
                        Перетащите изображения или нажмите
                        <input type="file" name="images[]" id="imagesInput" class="admin-panel__form-file" multiple />
                    </div>
                </div>

                <div class="admin-panel__form-image-preview">
                    <div class="admin-panel__form-image-grid" id="imagesPreviewInner"></div>
                    <div id="imageCount" class="admin-panel__form-image-count"></div>
                </div>

                <button type="submit" class="admin-panel__form-submit">Добавить</button>
            </form>

            <h2 class="admin-panel__subtitle">Список статей</h2>
            <div id="news-list" class="admin-panel__news-grid"></div>
        </div>

        <div class="admin-panel__progress" id="progressWrapper" style="overflow: hidden;">
            <div class="admin-panel__progress-bar" id="progressBar"></div>
            <div class="admin-panel__progress-text" id="progressText">0%</div>
        </div>

        <div class="admin-panel__toast" id="toast">Новость успешно добавлена!</div>

        <script src="/pages/admin/admin.js"></script>
    <?php endif; ?>

    <script>
        setTimeout(() => {
            const errorMsg = document.querySelector('.admin-login__error');
            if (errorMsg) {
                errorMsg.classList.add('hidden');
            }
        }, 2000);
    </script>
</body>

</html>