<?php
  /**
   * All requests go through this file
   */
  
   require_once('config.php');

   $error = false;

   // Create user account
   if(isset($_POST['create-user'])) {
    // Generate log
    $log = [
      "timestamp" => date('Y-m-d h:m:s', time()),
      "status" => "Fields Invalid",
      "user" => null,
      "password" => null
    ];
    // Make sure all fields are present
    if(isset($_POST['username']) && isset($_POST['password'])) {
      $username = $_POST['username'];
      $password = $_POST['password'] === "" ? false : $_POST['password'];
      // Update log
      $log["status"] = "Fields Valid";
      $log["user"] = $username;
      $log["password"] = $password ? (bool)true : (bool)false;
      // Check username isn't taken
      if(!file_exists(APP_PATH ."forms/$username")) {
        // Create user directory
        mkdir(APP_PATH ."forms/$username", 0755);
        // Create user file
        $user_file = fopen(APP_PATH ."forms/$username/user.json", "w");
        $user_details = [
          "forms" => [],
          "last_login" => time(),
          "password" => $password ? $password : (bool)false
        ];
        fwrite($user_file, json_encode($user_details, JSON_PRETTY_PRINT));
        fclose($user_file);
        // Make sure setup completed
        if(file_exists(APP_PATH ."forms/$username/user.json")) {
          // Update log
          $log["status"] = "Success";
          // Return response
          http_response_code(201);
          $response = [
            "message" => "Account created for $username"
          ];
        } else {
          // Update log
          $log["status"] = "Server Error";
          http_response_code(500);
          $response = [
            "message" => "Sever error: Couldn't create file"
          ];
        }
      } else {
        // Update log
        $log["status"] = "Username taken";
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
    // Write response to log file
    $log = json_encode($log)."\n";
    $filename = date('Y-m-d', time()) ."-users.txt";
    $log_file = fopen(APP_PATH . "logs/" . $filename, "a");
    fwrite($log_file, $log);
    fclose($log_file);
   }

   // Return response
   echo json_encode($response);
   die();
?>