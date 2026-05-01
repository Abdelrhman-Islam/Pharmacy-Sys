<?php
require_once '../cors.php'; 


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require_once '../config/db.php'; 

// استقبال التصنيف لو مبعوت من الـ Sidebar
$cat = isset($_GET['category']) ? $_GET['category'] : null;

try {
    if ($cat) {
        $sql = "SELECT * FROM products WHERE category_id = :cat ORDER BY id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['cat' => $cat]);
    } else {
        $sql = "SELECT * FROM products ORDER BY id DESC";
        $stmt = $pdo->query($sql);
    }

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "count" => count($products),
        "data" => $products
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}


