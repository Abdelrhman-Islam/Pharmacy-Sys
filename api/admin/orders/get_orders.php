<?php
// 1. إعدادات الـ CORS والـ JSON
header("Content-Type: application/json");
require_once '../../../cors.php'; 

// 2. الاتصال بقاعدة البيانات
require_once __DIR__ . '/../../../config/db.php'; 

// 3. التحقق من صلاحيات الأدمن
require_once __DIR__ . '/../../../middleware/admin_middleware.php';
confirmAdmin($connection); 

try {
    // 4. جلب الإحصائيات (Summary)
    $summary = [
        'total' => 0, 
        'pending' => 0, 
        'in_transit' => 0, 
        'completed' => 0, 
        'cancelled' => 0
    ];

    $summarySql = "SELECT status, COUNT(*) as count FROM orders GROUP BY status";
    $summaryResult = $connection->query($summarySql);

    if ($summaryResult) {
        while($row = $summaryResult->fetch_assoc()) {
            $count = (int)$row['count'];
            $status = $row['status'];
            
            $summary['total'] += $count;
            if (array_key_exists($status, $summary)) {
                $summary[$status] = $count;
            }
        }
    }

    // 5. جلب الطلبات + اسم العميل من users
    $sql = "
        SELECT 
            o.id,
            o.total_amount,
            o.status,
            o.created_at,
            COALESCE(u.name, o.name) AS customer_name,
            COALESCE(u.phone, o.phone) AS phone
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.id DESC
    ";

    $result = $connection->query($sql);
    
    $orders = [];
    if ($result) {
        while($row = $result->fetch_assoc()) {
            $orders[] = $row;
        }
    }

    // 6. إرجاع النتيجة
    echo json_encode([
        "status" => "success",
        "summary" => $summary,
        "orders" => $orders
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database Failure: " . $e->getMessage()
    ]);
}

$connection->close();
?>