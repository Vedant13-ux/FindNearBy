<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

require __DIR__.'/../classes/Database.php';
require __DIR__.'/../middlewares/Auth.php';



$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn,$allHeaders);


$returnData = [
    "success" => 0,
    "status" => 401,
    "message" => "Unauthorized"
];

if($auth->isAuth()){

    // IF REQUEST METHOD IS NOT EQUAL TO POST
    if($_SERVER["REQUEST_METHOD"] != "GET"):
        $returnData = msg(0,404,'Page Not Found!');
    
    else:
        $hotel_id = $auth->isAuth()['hotel_id'];
        $userEmail = $auth->isAuth()['email'];

        
        try{

            // GETTING ALL MEMBERS' EMAILS
            $fetch_users_by_email = "SELECT `email` FROM `customer` WHERE `hotel_id`=:hotel_id";
            $query_stmt = $conn->prepare($fetch_users_by_email);
            $query_stmt->bindValue(':hotel_id', $hotel_id,PDO::PARAM_STR);
            $query_stmt->execute();
            $customer_emails = array();

            if($query_stmt->rowCount()):
                while ($row = $query_stmt->fetch(PDO::FETCH_ASSOC)){
                    if ($row['email']!=$userEmail){
                        array_push($customer_emails,$row['email']);
                    }
                }
            endif;

            // GETTING SERVICES FROM HOTEL
            $fetch_hotel_by_id = "SELECT `Bus`,`Taxi`,`Dining`, `Self Care and Spa`, `Swimming Pool`, `Games and Entertainment` FROM `hotel` WHERE `hotel_id`=:hotel_id";
            $query_stmt = $conn->prepare($fetch_hotel_by_id);
            $query_stmt->bindValue(':hotel_id', $hotel_id,PDO::PARAM_STR);
            $query_stmt->execute();
            $services = array();
            if($query_stmt->rowCount()):
                while ($row2 = $query_stmt->fetch(PDO::FETCH_ASSOC)){
                    $services = $row2;
                }
            endif;

            $returnData =  [
                'success' => 1,
                'status' => 200,
                'emails' => $customer_emails, 
                'services' => $services
            ];
        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }
    endif;
    
}




echo json_encode($returnData);