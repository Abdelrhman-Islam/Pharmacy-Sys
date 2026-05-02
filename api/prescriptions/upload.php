<?php
require_once '../../config/db.php'; 
require_once '../../auth/auth.php'; // لازم يكون مسجل دخول
require_once '../../cors.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Method not allowed"]);
    exit;
}

$user_id = getAuthenticatedUserId($pdo);

if (!isset($_FILES['prescription'])) {
    echo json_encode(["status" => "error", "message" => "لم يتم اختيار ملف"]);
    exit;
}

$file = $_FILES['prescription'];
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
$fileType = mime_content_type($file['tmp_name']);

// 1. التحقق من نوع الملف
if (!in_array($fileType, $allowedTypes)) {
    echo json_encode(["status" => "error", "message" => "نوع الملف غير مدعوم، يرجى رفع صورة فقط"]);
    exit;
}

// 2. التحقق من الحجم (مثلاً 5 ميجا حد أقصى)
if ($file['size'] > 5 * 1024 * 1024) {
    echo json_encode(["status" => "error", "message" => "حجم الصورة كبير جداً"]);
    exit;
}

// 3. مسار الحفظ وتوليد اسم فريد (عشان مفيش ملف يمسح التاني)
$uploadDir = '../../uploads/prescriptions/';
$fileExt = pathinfo($file['name'], PATHINFO_EXTENSION);
$fileName = 'presc_' . $user_id . '_' . uniqid() . '.' . $fileExt;

if (move_uploaded_file($file['tmp_name'], $uploadDir . $fileName)) {
    // 4. حفظ في الداتابيز
    $stmt = $pdo->prepare("INSERT INTO prescriptions (user_id, image_path, status) VALUES (?, ?, 'pending')");
    $stmt->execute([$user_id, $fileName]);

    echo json_encode(["status" => "success", "message" => "تم رفع الروشتة بنجاح"]);
} else {
    echo json_encode(["status" => "error", "message" => "فشل حفظ الملف على السيرفر"]);
}
?>