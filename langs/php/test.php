<?php
  
  require_once('config.php');
  
  // Grab debug info for logging
  $debug = json_decode($_POST['debug'], true);
  $timestamp = time();

  // Remove debug from post for response
  unset($_POST['debug']);

  // Generate log
  $log_array = [
    "timestamp" => date('Y-m-d h:m:s', $timestamp),
    "form" => $debug['form'],
    "user" => $debug['username'],
    "form_data" => $_POST
  ];
  $log = json_encode($log_array)."\n";

  // Write response to log file
  $filename = date('Y-m-d', $timestamp) ."-tests.txt";
  $log_file = fopen(APP_PATH . "logs/" . $filename, "a");
  fwrite($log_file, $log);
  fclose($log_file);

  // Return json array
  echo json_encode($log_array, JSON_PRETTY_PRINT);

?>