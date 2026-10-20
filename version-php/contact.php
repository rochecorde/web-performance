<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['success' => false, 'message' => 'Méthode non autorisée.']);
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));
$website = trim((string) ($_POST['website'] ?? ''));

if ($website !== '') {
    respond(400, ['success' => false, 'message' => 'Soumission invalide.']);
}

if ($name === '' || strlen($name) > 300
    || $email === '' || strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false
    || $message === '' || strlen($message) > 10000
) {
    respond(422, ['success' => false, 'message' => 'Vérifiez les champs du formulaire.']);
}

$recipient = getenv('WP_CONTACT_TO') ?: '';
$copyRecipient = getenv('WP_CONTACT_CC') ?: '';
$sender = getenv('WP_MAIL_FROM') ?: '';

if (filter_var($recipient, FILTER_VALIDATE_EMAIL) === false
    || filter_var($copyRecipient, FILTER_VALIDATE_EMAIL) === false
    || filter_var($sender, FILTER_VALIDATE_EMAIL) === false
) {
    error_log('Web Performance contact form: mail settings are missing or invalid.');
    respond(503, ['success' => false, 'message' => 'Le formulaire n’est pas encore configuré. Réessayez plus tard ou écrivez-nous directement.']);
}

$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$subject = 'Nouvelle demande de projet - Web Performance';
$body = "Nouvelle demande reçue depuis le site Web Performance.\n\n"
    . "Nom : {$safeName}\n"
    . "Adresse e-mail : {$email}\n\n"
    . "Message :\n{$message}\n";
$encodedSenderName = '=?UTF-8?B?' . base64_encode('Web Performance') . '?=';
$headers = [
    'From' => $encodedSenderName . ' <' . $sender . '>',
    'Reply-To' => $email,
    'Cc' => $copyRecipient,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];

if (!mail($recipient, $subject, $body, $headers)) {
    error_log('Web Performance contact form: mail() failed to queue the message.');
    respond(502, ['success' => false, 'message' => 'L’envoi a échoué. Réessayez plus tard ou contactez-nous directement.']);
}

respond(200, ['success' => true, 'message' => 'Votre demande a été transmise.']);
