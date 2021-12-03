<?php
require __DIR__.'/../classes/JwtHandler.php';
class Auth extends JwtHandler{

    protected $db;
    protected $headers;
    protected $token;
    public function __construct($db,$headers) {
        parent::__construct();
        $this->db = $db;
        $this->headers = $headers;
    }

    public function isAuth(){
        if(array_key_exists('Authorization',$this->headers) && !empty(trim($this->headers['Authorization']))):
            $this->token = explode(" ", trim($this->headers['Authorization']));
            if(isset($this->token[1]) && !empty(trim($this->token[1]))):
                
                $data = $this->_jwt_decode_data($this->token[1]);

                if(isset($data['auth']) && isset($data['data']->user_id) && $data['auth']):
                    $user = $this->fetchUser($data['data']->user_id);
                    return $user;

                else:
                    return null;

                endif; // End of isset($this->token[1]) && !empty(trim($this->token[1]))
                
            else:
                return null;

            endif;// End of isset($this->token[1]) && !empty(trim($this->token[1]))

        else:
            return null;

        endif;
    }

    protected function fetchUser($user_id){
        try{
            $fetch_user_by_id = "SELECT `name`,`email`, `hotel_id`, `hotel_name` FROM `customer` WHERE `cust_id`=:cust_id";
            $query_stmt = $this->db->prepare($fetch_user_by_id);
            $query_stmt->bindValue(':cust_id', $user_id,PDO::PARAM_INT);
            $query_stmt->execute();

            if($query_stmt->rowCount()):
                $row = $query_stmt->fetch(PDO::FETCH_ASSOC);
                return $row;
            else:
                return null;
            endif;
        }
        catch(PDOException $e){
            return null;
        }
    }
}