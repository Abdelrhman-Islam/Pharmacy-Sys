<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../auth/auth.php';

$user_id = getAuthenticatedUserId($pdo); 

try {
    $stmt = $pdo->prepare("
        SELECT cart.*, products.name, products.price, products.pic 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_id = ?
    ");
    $stmt->execute([$user_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>