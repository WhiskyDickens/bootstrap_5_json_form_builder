<?php
  /**
   * All requests go through this file
   */

   // Create user account
   if(isset($_POST['create-user'])) {
    
     $response = [
       "code" => 200,
       "message" => "User created"
     ];
   }
   
   echo json_encode($response);
?>