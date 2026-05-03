<?php
require_once '../../../cors.php'; 
require_once __DIR__ . '/../../../config/db.php'; 
require_once '../../../middleware/admin_middleware.php';

header("Content-Type: application/json");

confirmAdmin($connection);

// 📌 البيانات
$product_id   = $_POST['product_id'] ?? null;
$category_id  = $_POST['category_id'] ?? null;
$name         = $_POST['name'] ?? null;
$description  = $_POST['description'] ?? '';
$price        = $_POST['price'] ?? null;
$qty          = $_POST['qty'] ?? null;

if (!$product_id || !$name || !$category_id || !$price || !$qty) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Missing required fields"
    ]);
    exit;
}

// 📌 الصورة (اختياري)
$pic_name = null;

if (isset($_FILES['pic']) && $_FILES['pic']['error'] === 0) {

    // ✅ FIXED PATH (مهم جدًا)
    $upload_dir = __DIR__ . '/../../../uploads/products/';

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
    }

    $extension = pathinfo($_FILES['pic']['name'], PATHINFO_EXTENSION);
    $pic_name = time() . '_' . uniqid() . '.' . $extension;

    $upload_path = $upload_dir . $pic_name;

    // ✅ check upload success
    if (!move_uploaded_file($_FILES['pic']['tmp_name'], $upload_path)) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Image upload failed"
        ]);
        exit;
    }
}

try {

    // 📌 لو في صورة حدثها
    if ($pic_name) {
        $sql = "UPDATE products 
                SET category_id = :cat,
                    name = :name,
                    description = :description,
                    price = :price,
                    qty = :qty,
                    pic = :pic
                WHERE id = :id";
    } else {
        $sql = "UPDATE products 
                SET category_id = :cat,
                    name = :name,
                    description = :description,
                    price = :price,
                    qty = :qty
                WHERE id = :id";
    }

    $stmt = $pdo->prepare($sql);

    $params = [
        'cat' => $category_id,
        'name' => $name,
        'description' => $description,
        'price' => $price,
        'qty' => $qty,
        'id' => $product_id
    ];

    if ($pic_name) {
        $params['pic'] = $pic_name;
    }

    $stmt->execute($params);

    echo json_encode([
        "status" => "success",
        "message" => "Product updated successfully"
    ]);

} catch (PDOException $e) {

    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>