# formula

## Bootstrap 5 JSON Form Builder

Formula allows users to create Bootstrap 5 forms in a drag-and-drop interface, without the knowledge of coding and without needing to run a database! The entire storage system runs on JSON files and your browser's localStorage for session handling.

### General installation

- Download the repo
- Go to **/assets/js/config.js** and update appRoot to your local & remote directories

### PHP app version

- Run your Apache server. That's it.. you're good to go

### Python app version

- Run your Apache server.
- Ensure your httpd.conf file has a cgi-script handler for .py files
- Go to **/langs/pytho/n** and change the shebang in each file to your own executable Python file
- Run the following in cmd/terminal:
  - `pip install simplejson` (for json usage)
  - `pip install -U flask-cors` (to allow cors settings)
  - `pip install django` (to allow cors settings)
