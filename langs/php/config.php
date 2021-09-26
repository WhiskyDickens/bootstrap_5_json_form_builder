<?php
  /**
   * Global configuration file
   */

  // Define app root directory
  define('APP_PATH', dirname(dirname(__DIR__)) ."/");

  // CORS: Allow requests from github pages
  if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] == 'https://whiskydickens.github.io') {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }