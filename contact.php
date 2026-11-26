<?php
declare(strict_types=1);

// Set these to the mailbox created in cPanel before deploying.
$contactMailbox = 'contact@your-domain.com'; //to be replaced
$senderMailbox = 'contact@your-domain.com'; //to be replaced

header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: no-referrer');
header("Content-Security-Policy: default-src 'none'; base-uri 'none'; frame-ancestors 'none'");

function respond(int $statusCode, string $message): never
{
    http_response_code($statusCode);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store');

    $safeMessage = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    echo '<!doctype html><html lang="en"><head><meta charset="UTF-8">';
    echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
    echo '<title>Notos Art Centre | Contact</title></head><body>';
    echo '<main><h1>Contact Notos Art Centre</h1><p>' . $safeMessage . '</p>';
    echo '<p><a href="index.html#contact">Return to the contact form</a></p>';
    echo '</main></body></html>';
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'This endpoint accepts contact form submissions only.');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 16384) {
    respond(413, 'Your message is too large. Please shorten it and try again.');
}

$name = $_POST['name'] ?? null;
$email = $_POST['email'] ?? null;
$subject = $_POST['subject'] ?? null;
$message = $_POST['message'] ?? null;
$website = $_POST['website'] ?? '';

if (!is_string($name) || !is_string($email) || !is_string($subject) || !is_string($message) || !is_string($website)) {
    respond(400, 'Please complete all fields with valid text and try again.');
}

// Silently discard likely automated submissions caught by the honeypot.
if (trim($website) !== '') {
    respond(200, 'Thank you. Your message has been received.');
}

$name = trim(str_replace(["\r", "\n"], ' ', $name));
$email = trim($email);
$subject = trim(str_replace(["\r", "\n"], ' ', $subject));
$message = trim(str_replace(["\r\n", "\r"], "\n", $message));

if (
    $name === '' || strlen($name) > 100 ||
    $email === '' || strlen($email) > 254 || preg_match('/[\r\n]/', $email) ||
    filter_var($email, FILTER_VALIDATE_EMAIL) === false ||
    $subject === '' || strlen($subject) > 150 ||
    $message === '' || strlen($message) > 5000
) {
    respond(400, 'Please check the fields and their length, then try again.');
}

if (
    filter_var($contactMailbox, FILTER_VALIDATE_EMAIL) === false ||
    filter_var($senderMailbox, FILTER_VALIDATE_EMAIL) === false
) {
    error_log('Contact form is not configured with valid cPanel mailbox addresses.');
    respond(500, 'The contact form is not available right now. Please contact us by phone.');
}

$mailSubject = 'Notos Art Centre contact form enquiry';
$mailBody = "Name: {$name}\nEmail: {$email}\nSubject: {$subject}\n\nMessage:\n{$message}\n";
$headers = [
    'From' => 'Notos Art Centre <' . $senderMailbox . '>',
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
];

if (!mail($contactMailbox, $mailSubject, $mailBody, $headers)) {
    error_log('PHP mail() failed to accept a Notos Art Centre contact form message.');
    respond(500, 'We could not send your message right now. Please try again later or contact us by phone.');
}

respond(200, 'Thank you. Your message has been sent to Notos Art Centre.');