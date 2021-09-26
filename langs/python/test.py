#!C:/Python39/python.exe

# Import modules
import sys
import json
import cgi

# Set defaults
field = ""
value = ""
response = {}

# Grab form data
form = cgi.FieldStorage()
# Concat each form field name and value to string
for key in form.keys():
        field = str(key)
        value = str(form.getvalue(field))
        response[field] = value

sys.stdout.write("Content-Type: application/json")
sys.stdout.write("Status: 200 OK")
sys.stdout.write("\n\n")
sys.stdout.write(json.dumps(response))