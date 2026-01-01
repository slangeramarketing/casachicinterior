<?php
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  echo json_encode(["success" => false]);
  exit;
}

$name = $_POST["name"] ?? "";
$email = $_POST["email"] ?? "";
$phone = $_POST["phone"] ?? "";
$message = $_POST["message"] ?? "";

if (!$name || !$email || !$phone || !$message) {
  echo json_encode(["success" => false]);
  exit;
}

$to = "casa.chic.interior@gmail.com";
$subject = "New Contact Enquiry - CasaChic Interior";
$body = "
Name: $name
Email: $email
Phone: $phone

Message:
$message
";

$headers = "From: $email";

$sent = mail($to, $subject, $body, $headers);

echo json_encode(["success" => $sent]);
