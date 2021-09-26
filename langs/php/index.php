<?php
  /**
   * All requests go through this file
   */
  
   require_once('config.php');

   $error = false;

   // Create user account
   if(isset($_POST['create-user'])) { 
    // Make sure all fields are present
    if(isset($_POST['username']) && isset($_POST['password'])) {
      $username = $_POST['username'];
      $password = $_POST['password'] === "" ? 0 : $_POST['password'];
      // Check username isn't taken
      if(!file_exists(APP_PATH ."forms/$username")) {
        // Create user directory
        mkdir(APP_PATH ."forms/$username", 0755);
        // Create user file
        $user_file = fopen(APP_PATH ."forms/$username/user.json", "w");
        $user_details = [
          "forms" => [],
          "last_login" => time(),
          "password" => $_POST['password'] ? : false
        ];
        fwrite($user_file, json_encode($user_details, JSON_PRETTY_PRINT));
        fclose($user_file);
        // Make sure setup completed
        if(file_exists(APP_PATH ."forms/$username/user.json")) {
          http_response_code(201);
          $response = [
            "message" => "Account created for $username"
          ];
        } else {
          http_response_code(500);
          $response = [
            "message" => "Sever error: Couldn't create file"
          ];
        }
      } else {
        http_response_code(400);
        $response = [
          "message" => "Error: That username is already taken"
        ];
      }
    } else {
      http_response_code(400);
      $response = [
        "message" => "Bad request: Missing data. Please try again."
      ];
    }
   }

   // Return response
   echo json_encode($response);
   die();
?>