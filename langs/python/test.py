#!C:/Python39/python.exe

# Import modules
import config
import sys
import json
import cgi
from datetime import datetime

# Set defaults
field = ""
value = ""
log_dict = {}
response = {}

# Grab form data
form = cgi.FieldStorage()

# Concat each form field name and value to string
for key in form.keys():
        field = str(key)
        value = str(form.getvalue(field))
        response[field] = value

# Generate log
debug = json.loads(response["debug"])
now = datetime.now()

# Remove debug from post for response
response.pop("debug")

#Generate log
log_dict["timestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
log_dict["form"] = debug["form"]
log_dict["user"] = debug["username"]
log_dict["form_data"] = response
log = json.dumps(log_dict) +"\n";

# Write response to log file
filename = now.strftime("%Y-%m-%d")
filename += "-tests.txt";
log_file = open(config.app_root +"logs/"+ filename, "a");
log_file.write(log);
log_file.close();

sys.stdout.write("Content-Type: application/json")
sys.stdout.write("Status: 200 OK")
sys.stdout.write("\n\n")
sys.stdout.write(json.dumps(log_dict, indent=2))