<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    exit("Forbidden");
}


if (isset($_SESSION['last_form_time']) && time() - $_SESSION['last_form_time'] < 30) {
    http_response_code(429);
    exit("Слишком частая отправка. Подождите немного.");
}
$_SESSION['last_form_time'] = time();

$name = htmlspecialchars(trim($_POST["name"] ?? ''));
$phone = htmlspecialchars(trim($_POST["phone"] ?? ''));
$email = htmlspecialchars(trim($_POST["email"] ?? ''));
$location = htmlspecialchars(trim($_POST["location"] ?? ''));


if (!$name || !$phone || !$email || !$location) {
    http_response_code(400);
    exit("Пожалуйста, заполните все поля.");
}


$config = require __DIR__ . '/mail_config.php';

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = $config['secure'];
    $mail->Port = $config['port'];

    $mail->setFrom($config['username'], 'Сайт Зенит - Чемпионика');
    $mail->addAddress('Zenit.info25@mail.ru'); // получатель

    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'Заявка на пробную тренировку';
    $mail->Body = <<<EOT
Имя и фамилия: $name
Телефон: $phone
Email: $email
Адрес: $location
EOT;

    $mail->send();
    echo "Спасибо! Ваша заявка отправлена.";
} catch (Exception $e) {
    http_response_code(500);
    echo "Ошибка при отправке: {$mail->ErrorInfo}";
    error_log("Ошибка при отправке: {$mail->ErrorInfo}");
}
