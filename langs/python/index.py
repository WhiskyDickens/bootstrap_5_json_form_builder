#!C:/Python39/python.exe

# Import modules
import config
import os
import sys
import json
import cgi
from datetime import datetime

# Set defaults
error = False
http_response = ""
response = {}
log = {}
now = datetime.now()
user_info = {"forms": [], "last_login": round(datetime.timestamp(now))}
form = cgi.FieldStorage()

# Create a user account
if form["create-user"]:
    # Generate log
    log["timestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
    log["status"] = "Fields Invalid"
    log["user"] = ""
    log["password"] = ""
    # Make sure username and password are present
    if form["username"] and form["password"]:
        username = form["username"].value
        password = form["password"].value
        if password == "0":
            password = bool(0)
        user_info["password"] = password
        http_response = "200 OK"
        # Update log
        log["status"] = "Fields Valid"
        log["user"] = username
        log_password = password
        if log_password != bool(0):
            log_password = bool(1)
        log["password"] = log_password
        # Check username isn't taken
        if os.path.isdir(config.app_root + "/forms/"+ username):
            log["status"] = "Username taken"
            http_response = "400 Bad request"
            response["message"] = "Error: That username is already taken"
        else:
            # Username isn't taken, create folder and user file
            try:
                # Create user directory
                os.mkdir(config.app_root + "forms/"+ username, 0o755)
                # Create user file
                user_file = open(config.app_root + "forms/"+ username +"/user.json", "w")
                user_file.write(json.dumps(user_info, indent=4))
                user_file.close()
                response["message"] = "Account created for "+ username
                log["status"] = "Success"
            except OSError as error:
                http_response = "500 Server error"
                response["message"] = error
                log["status"] = "Server error"
    else:
        # Fields missing
        http_response = "400 Bad request"
        response["message"] = "Missing data"

    # Write response to log file
    log = json.dumps(log) +"\n";
    filename = now.strftime("%Y-%m-%d")
    filename += "-users.txt";
    log_file = open(config.app_root +"logs/"+ filename, "a");
    log_file.write(log);
    log_file.close();
else:
  # Unknown request
  http_response = "400 Bad request"

# Print body
sys.stdout.write("Content-Type: application/json")
sys.stdout.write("Status: "+ http_response)
sys.stdout.write("\n\n")
sys.stdout.write(json.dumps(response))