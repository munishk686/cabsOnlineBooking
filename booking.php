<?php
include ("bookingresetdb.php");

$name = $_POST['cname'];
$phone = $_POST['phone'];
$unumber = $_POST['unumber'];
$snumber = $_POST['snumber'];
$stname = $_POST['stname'];
$sbname = $_POST['sbname'];
$dsbname = $_POST['dsbname'];
$date = $_POST['date'];
$time = $_POST['time'];

// Create connection
$conn = new mysqli($host, $user, $pswd, $dbnm);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Generate a unique booking reference number
$referenceNumber = generateUniqueReference($conn);

// Function to generate a unique booking reference number
function generateUniqueReference($conn)
{
    $prefix = 'BRN';
    $digits = 5;

    // Get the current maximum booking reference number from the database
    $query = "SELECT MAX(SUBSTRING(reference_number, 4)) AS max_reference FROM assign2";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    $maxReference = $row['max_reference'];

    // Increment the maximum reference number
    $nextReferenceNumber = str_pad((intval($maxReference) + 1), $digits, '0', STR_PAD_LEFT);

    // Generate the next booking reference number
    $referenceNumber = $prefix . $nextReferenceNumber;

    return $referenceNumber;
}

// Insert the values into the table
$insertQuery = "INSERT INTO assign2 (reference_number, customer_name, phone_number, unit_number, street_number, street_name, suburb, destination_suburb, pick_up_date, pick_up_time, status) 
VALUES ('$referenceNumber', '$name', '$phone', '$unumber', '$snumber', '$stname', '$sbname', '$dsbname', '$date', '$time', 'unassigned')";

if ($conn->query($insertQuery) === false) {
    die("Error inserting values: " . $conn->error);
} else {
    // Directly echo the message in HTML format
    $message = "Thank you for your booking!";
    echo '<div style="border: 1px solid black; padding: 10px;">';
    echo '<h1>' . $message . '</h1>';
    echo '<h5>Booking reference number: ' . $referenceNumber . '</h5>';
    echo '<h5 style="margin-right: 10px;">Pickup time: ' . $time . '</h5>';
    echo '<h5 style="margin-right: 10px;">Pickup date: ' . $date . '</h5>';
    echo '</div>';

}

$conn->close();
?>