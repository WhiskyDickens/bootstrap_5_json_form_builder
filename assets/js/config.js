/**
 * Global config file
 */

// Set root directory, based on file location
let appRoot;
if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
  appRoot = "./";
} else {
  appRoot = "https://simtaylor.com/web-apps/formula/";
}

console.log(appRoot);

// Set default app version (default to PHP)
const appVersion = localStorage.getItem("app-version") ? localStorage.getItem("app-version") : "php";

// List of app versions available
const appVersions = {
  0: "php",
  1: "python",
};
// Set entry points for each app version (for ajax)
const ajaxEndpoints = {
  php: {
    site: "index.php",
    test: "test.php",
  },
  python: {
    site: "index.py",
    test: "test.py",
  },
};

// If user is logged in, load their account. Otherwise load the demo account
let username = localStorage.getItem("username") ? localStorage.getItem("username") : "demo";
