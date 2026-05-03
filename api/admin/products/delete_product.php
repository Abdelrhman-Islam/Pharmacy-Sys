<?php
require_once '../../../cors.php';
require_once __DIR__ . '/../../../config/db.php';
require_once '../../../middleware/admin_middleware.php';

header("Content-Type: application/json");

confirmAdmin($connection);

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['product_id'] ?? null;

if (!$id) {
    echo json_encode([
        "status" => "error",
        "message" => "Missing product id"
    ]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM products WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode([
        "status" => "success",
        "message" => "Product deleted"
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>