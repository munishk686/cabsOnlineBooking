<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include ("bookingresetdb.php");

header('Content-Type: application/json');

$conn = new mysqli($host, $user, $pswd, $dbnm);
if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

$bsearch = isset($_GET['bsearch']) ? $_GET['bsearch'] : '';

if ($bsearch) {
    // Validate and sanitize the input
    if (!preg_match('/^BRN\d{5}$/', $bsearch)) {
        echo json_encode(['error' => 'Invalid reference number format']);
        exit;
    }

    $query = $conn->prepare("SELECT * FROM assign2 WHERE reference_number = ?");
    $query->bind_param('s', $bsearch);
} else {
    $currentDateTime = date('Y-m-d H:i:s');
    $twoHoursLater = date('Y-m-d H:i:s', strtotime('+2 hours'));

    $query = $conn->prepare("SELECT * FROM assign2 WHERE status = 'unassigned' AND pick_up_date BETWEEN ? AND ?");
    $query->bind_param('ss', $currentDateTime, $twoHoursLater);
}

$query->execute();
$result = $query->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$query->close();
$conn->close();

echo json_encode($data);
exit;
?>