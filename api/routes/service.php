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

require __DIR__.'/../middlewares/Auth.php';
require __DIR__.'/../classes/Database.php';

// INCLUDING DATABASE AND MAKING OBJECT
$allHeaders = getallheaders();
$db_connection = new Database();
$conn = $db_connection->dbConnection();
$auth = new Auth($conn,$allHeaders);


$data = json_decode(file_get_contents("php://input"));
$returnData = [
    "success" => 0,
    "status" => 401,
    "message" => "Unauthorized"
];
if($auth->isAuth()){

    // IF REQUEST METHOD IS NOT EQUAL TO POST
    if($_SERVER["REQUEST_METHOD"] != "POST"):
        $returnData = msg(0,404,'Page Not Found!');
    
    // IF REQUEST METHOD IS POST
    else:
        
        // GETTING THE USER
        $user = $auth->isAuth();

        $service_name = trim($data->service_name);
        $amount = trim($data->amount);
        $date = trim($data->date);
        $time = trim($data->time);
        $customer_emails = $data->people_selected;

        try{

            // INSERTING INTO SERVICE TABLE
            $insert_query = "INSERT INTO `service`(`service_name`,`booked_by`,`amount`,`date`,`time`) VALUES(:service_name,:booked_by,:amount,:date,:time)";
            $insert_stmt = $conn->prepare($insert_query);

            // DATA BINDING
            $insert_stmt->bindValue(':service_name', htmlspecialchars(strip_tags($service_name)),PDO::PARAM_STR);
            $insert_stmt->bindValue(':booked_by', $user['email'],PDO::PARAM_STR);
            $insert_stmt->bindValue(':amount', $amount,PDO::PARAM_INT);
            $insert_stmt->bindValue(':date', $date,PDO::PARAM_STR);
            $insert_stmt->bindValue(':time', $time,PDO::PARAM_STR);            

            $insert_stmt->execute();


            // INSERTING INTO SERVICE_CUSTOMER TABLE
            $last_id = $conn->lastInsertId();

            $insert_query = "INSERT INTO `service_customer`(`service_id`,`customer_email`) VALUES(:service_id,:customer_email)";
            $insert_stmt = $conn->prepare($insert_query);
            $insert_stmt->bindValue(':service_id', $last_id,PDO::PARAM_STR);
            $insert_stmt->bindValue(':customer_email', $user['email'], PDO::PARAM_STR);
            $insert_stmt->execute();

                
            foreach ($customer_emails as $email) {
                $insert_query = "INSERT INTO `service_customer`(`service_id`,`customer_email`) VALUES(:service_id,:customer_email)";
                $insert_stmt = $conn->prepare($insert_query);
                $insert_stmt->bindValue(':service_id', $last_id,PDO::PARAM_STR);
                $insert_stmt->bindValue(':customer_email', $email,PDO::PARAM_STR);
                $insert_stmt->execute();
            }

            
            $returnData = msg(1,201,'You have added service Successfully');

        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }
        // echo "Hello World";
    endif;

    
}





echo json_encode($returnData);