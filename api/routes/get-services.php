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

        $email = $auth->isAuth()['email'];
        try{
            $fetch_services_by_email = "SELECT `service_id` FROM `service_customer` WHERE `customer_email`=:customer_email";
            $query_stmt = $conn->prepare($fetch_services_by_email);
            $query_stmt->bindValue(':customer_email', $email,PDO::PARAM_STR);
            $query_stmt->execute();

            if($query_stmt->rowCount()):
                $services = array();
                while ($row = $query_stmt->fetch(PDO::FETCH_ASSOC)){
                    array_push($services,$row['service_id']);
                }

                $finalData = array();
                foreach($services as $service):
                    $fetch_service_by_id = "SELECT `service_name`,`amount`,`date`, `time`, `booked_by` FROM `service` WHERE `id`=:service_id";
                    $query_stmt = $conn->prepare($fetch_service_by_id);
                    $query_stmt->bindValue(':service_id', $service,PDO::PARAM_STR);
                    $query_stmt->execute();
                    $service_data = $query_stmt->fetch(PDO::FETCH_ASSOC);
                    $temp_data  = array(
                        "service_name" => $service_data['service_name'],
                        "amount" => $service_data['amount'],
                        "date" => $service_data['date'],
                        "time" => $service_data['time'],
                        "booked_by" => $service_data['booked_by']
                    );
                    array_push($finalData,$temp_data);

                $returnData =  [
                    'success' => 1,
                    'status' => 200,
                    'services' => $finalData
                ];
                endforeach;

            else:
                $returnData =  [
                    'success' => 1,
                    'status' => 200,
                    'services' => []
                ];
            endif;
        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }
    endif;
    
}




echo json_encode($returnData);