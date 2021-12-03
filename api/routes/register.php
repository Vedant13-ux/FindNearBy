<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
$SECRET_KEY = 'secret1234';

function msg($success,$status,$message,$extra = []){
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ],$extra);
}

// INCLUDING DATABASE AND MAKING OBJECT
require __DIR__.'/../classes/Database.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

// GET DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

// IF REQUEST METHOD IS NOT POST
if($_SERVER["REQUEST_METHOD"] != "POST"):
    $returnData = msg(0,404,'Page Not Found!');

elseif($SECRET_KEY != $data->secret_key):
    $returnData = msg(0,401,'UnAuthorized Access!');

// CHECKING EMPTY FIELDS
elseif(!isset($data->name) 
    || !isset($data->email) 
    || !isset($data->password)
    || !isset($data->hotel_id)
    || !isset($data->hotel_name)
    || empty(trim($data->name))
    || empty(trim($data->email))
    || empty(trim($data->password))
    || empty(trim($data->hotel_id))
    || empty(trim($data->hotel_name))):

    $fields = ['fields' => ['name','email','password', 'hotel_id', 'hotel_name']];
    $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);

// IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $name = trim($data->name);
    $email = trim($data->email);
    $password = trim($data->password);
    $hotel_id = trim($data->hotel_id);
    $hotel_name = trim($data->hotel_name);


    if(!filter_var($email, FILTER_VALIDATE_EMAIL)):
        $returnData = msg(0,422,'Invalid Email Address!');
    
    elseif(strlen($password) < 4):
        $returnData = msg(0,422,'Your password must be at least 4 characters long!');

    elseif(strlen($name) < 3):
        $returnData = msg(0,422,'Your name must be at least 3 characters long!');

    else:
        try{

            $check_email = "SELECT `email` FROM `customer` WHERE `email`=:email";
            $check_email_stmt = $conn->prepare($check_email);
            $check_email_stmt->bindValue(':email', $email,PDO::PARAM_STR);
            $check_email_stmt->execute();

            if($check_email_stmt->rowCount()):
                $returnData = msg(0,422, 'This E-mail already in use!');
            
            else:
                $insert_query = "INSERT INTO `customer`(`name`,`email`,`password`,`hotel_id`, `hotel_name`) VALUES(:name,:email,:password,:hotel_id,:hotel_name)";

                $insert_stmt = $conn->prepare($insert_query);

                // DATA BINDING
                $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)),PDO::PARAM_STR);
                $insert_stmt->bindValue(':email', $email,PDO::PARAM_STR);
                $insert_stmt->bindValue(':hotel_id', $hotel_id,PDO::PARAM_INT);
                $insert_stmt->bindValue(':hotel_name', $hotel_name,PDO::PARAM_STR);
                $insert_stmt->bindValue(':password', $password,PDO::PARAM_STR);
                

                $insert_stmt->execute();

                $returnData = msg(1,201,'You have successfully registered.');

            endif;

        }
        catch(PDOException $e){
            $returnData = msg(0,500,$e->getMessage());
        }
    endif;
    
endif;

echo json_encode($returnData);