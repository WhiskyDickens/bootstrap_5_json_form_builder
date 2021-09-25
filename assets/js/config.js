/**
 * Global config file
 */

// Set default app version
const appVersion = localStorage.getItem("app-version") ? localStorage.getItem("app-version") : "php";

// List of app versions available
const appVersions = {
  0: "php",
};
// Set entry points for each app version (for ajax)
const ajaxEndpoints = {
  php: "index.php",
};

// Set current user in local storage
let randomUsername = `user${Math.floor(Math.random() * 10000 + 1)}`;
const username = localStorage.getItem("username") ? localStorage.getItem("username") : randomUsername;
