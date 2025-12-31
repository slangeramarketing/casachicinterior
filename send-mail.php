<?php
header("Content-Type: application/json");

// Allow only POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  echo json_encode(["success" => false, "message" => "Method not allowed"]);
  exit;
}

// Sanitize inputs
$name    = htmlspecialchars(trim($_POST["name"] ?? ""));
$email   = htmlspecialchars(trim($_POST["email"] ?? ""));
$phone   = htmlspecialchars(trim($_POST["phone"] ?? ""));
$message = htmlspecialchars(trim($_POST["message"] ?? ""));

// Basic validation
if (!$name || !$email || !$phone || !$message) {
  http_response_code(400);
  echo json_encode(["success" => false, "message" => "All fields required"]);
  exit;
}

$to = "help@casachic.com"; // 👈 your business email
$subject = "New Contact Enquiry - CasaChic Interior";

$headers  = "From: CasaChic Interior <no-reply@casachic.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = "
New Contact Enquiry

Name: $name
Email: $email
Phone: $phone

Message:
$message
";

if (mail($to, $subject, $body, $headers)) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  echo json_encode(["success" => false, "message" => "Mail failed"]);
}
