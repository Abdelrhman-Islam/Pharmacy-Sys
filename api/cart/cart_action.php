<?php
require_once '../../cors.php';
require_once __DIR__ . '/../../config/db.php'; 
require_once __DIR__ . '/../../auth/auth.php';

// Secure source for user_id
$user_id = getAuthenticatedUserId($pdo);

header('Content-Type: application/json');

// Receive input data
$input = json_decode(file_get_contents("php://input"), true);
$action = $input['action'] ?? $_POST['action'] ?? '';
$id = $input['id'] ?? $_POST['id'] ?? 0;

try {
    // Handle add
    if ($action == 'add') {
        $product_id = $input['product_id'] ?? $_POST['product_id'] ?? null;

        if (!$product_id) throw new Exception("Incomplete product data");

        // Use authenticated user_id
        $stmt = $pdo->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1) 
                                ON DUPLICATE KEY UPDATE quantity = quantity + 1");
        $stmt->execute([$user_id, $product_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Added to cart']);
    }

    // Handle delete
    elseif ($action == 'delete') {
        if (!$id) throw new Exception("Product ID missing");
        
        // Verify user ownership
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $user_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Deleted']);
    }

    // Handle update
    elseif ($action == 'update') {
        $new_qty = $input['quantity'] ?? $_POST['quantity'] ?? 1;
        if ($new_qty < 1) $new_qty = 1;
        
        // Verify user ownership
        $stmt = $pdo->prepare("UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?");
        $stmt->execute([$new_qty, $id, $user_id]);
        
        echo json_encode(['status' => 'success', 'message' => 'Updated']);
    }

    else {
        throw new Exception("Invalid action");
    }

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>