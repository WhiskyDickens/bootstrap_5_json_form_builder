#!C:/Python39/python.exe

# Import modules
import config
import os
import sys
import json
import cgi
import time;

# Set defaults
error = False
http_response = ""
response = {}
user_info = {"forms": [], "last_login": round(time.time())}
form = cgi.FieldStorage()

# Create a user account
if form["create-user"]:
    # Make sure username and password are present
    if form["username"] and form["password"]:
      username = form["username"].value
      password = form["password"].value
      if password == "false":
        password = 0
      user_info["password"] = password
      http_response = "200 OK"
      # Check username isn't taken
      if os.path.isdir(config.app_root + "/forms/"+ username):
        http_response = "400 Bad request"
        response["message"] = "Error: That username is already taken"
      else:
        # Username isn't taken, create folder and user file
        try:
          # Create user directory
          os.mkdir(config.app_root + "/forms/"+ username, 0o666)
          # Create user file
          user_file = open(config.app_root + "/forms/"+ username +"/user.json", "w")
          user_file.write(json.dumps(user_info, indent=4))
          user_file.close()
          response["message"] = "Account created for "+ username
        except OSError as error:
          http_response = "500 Server error"
          response["message"] = error
    else:
      # Fields missing
      http_response = "400 Bad request"
      response["message"] = "Missing data"
else:
  # Unknown request
  http_response = "400 Bad request"

# Print body
sys.stdout.write("Content-Type: application/json")
sys.stdout.write("Status: "+ http_response)
sys.stdout.write("\n\n")
sys.stdout.write(json.dumps(response))