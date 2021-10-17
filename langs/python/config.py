#!C:/Python39/python.exe

# Import modules
import os
from flask import Flask
from flask_cors import CORS

# CORS policy
app = Flask(__name__)
cors_config = {
  "origins": ["http://localhosts"]
}
CORS(app, resources={"*": cors_config})

# Get app directory
curr_dir = os.getcwd()
python_dir = os.path.dirname(curr_dir)
app_root = os.path.dirname(python_dir) +"/"