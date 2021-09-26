"use strict";

import { formConstructor } from "./form_constructor.js";

jQuery(document).ready(function ($) {
  /* ===========================
  ======== USER ACCOUNT ========
  ============================== */

  // Init user
  getUser(username);

  // Set username
  function setUser(username) {
    // Remove auth token
    localStorage.removeItem("authenticated");
    getUser(username);
  }

  // Get user's information
  function getUser(username) {
    // If username not set, grab it from localStorage
    if (!username) {
      username = localStorage.getItem("username");
    }
    $.get({ url: `forms/${username}/user.json`, cache: false }, function (userData) {
      // Requires a password?
      if (userData.password != false && !localStorage.getItem("authenticated")) {
        let input = prompt(`Password for ${username}:\nType "demo" for demo account`, "");
        // Is user validated?
        if (input === userData.password) {
          authenticateUser(username, userData);
        } else {
          // Not validated
          notification("Account", `Incorrect password for ${username}`, "error")
            .promise()
            .then(function () {
              getUser(username);
            });
        }
      } else {
        authenticateUser(username, userData);
      }
    }).fail(function () {
      createUser(username);
      notification("Account", `Account ${username} not found`, "error");
    });
  }

  // Create user
  function createUser(username) {
    let password = prompt(`Create a password for ${username}:\n(leave blank if you don't want authentication)`, ``);
    if (password || password === "") {
      password = password ? password : false;
      let response = false;
      $.ajax({
        url: `langs/${appVersion}/${ajaxEndpoints[appVersion]["site"]}`,
        data: { "create-user": true, username: username, password: password },
        type: "post",
        cache: false,
        // Created account
        success: function (data) {
          notification("Account", `Account created for ${username}`, "success");
          setUser(username);
        },
        // Account couldn't be created
        error: function (data) {
          notification("Account", `Couldn't create an account for ${username}`, "error");
        },
      });
      return response;
    } else {
      notification("Account", `Account creating cancelled for ${username}`, "info");
    }
  }

  // Authenticate the user (and update interface)
  function authenticateUser(username, userData) {
    // Validated
    notification(`Authentication`, `You've successfully logged in as ${username}`, "success");
    // Set auth token
    localStorage.setItem("username", username);
    document.querySelector('input[name="username"]').setAttribute("value", username);
    localStorage.setItem("authenticated", true);
    // Populate interface
    populateInterface(username, userData);
  }

  /* ===========================
  =========== FORMS ============
  ============================== */

  // Get a particular form that belongs to a user
  function getForm(username, form_id, notify = false) {
    let response = false;
    $.ajax({
      url: `forms/${username}/${form_id}.json`,
      type: "get",
      dataType: "json",
      async: false,
      cache: false,
      success: function (formData) {
        response = formData;
        if (notify === true) {
          notification(`${formData.form_name}`, ` ${formData.form_name} (${username}/${form_id}) loaded successfully`, "success");
        }
      },
      error: function () {
        notification(`Form error`, `Form ${username}/${form_id} not found`, "error");
      },
    });
    return response;
  }

  // User wants to edit a form
  function editForm(username, form_id) {
    const form = getForm(username, form_id, true);
    const lastUpdate = new Date(form.last_updated * 1000);
    const lastUpdated = `${lastUpdate.getDate()}/${lastUpdate.getMonth()}/${lastUpdate.getFullYear()} at ${lastUpdate.getHours()}:${lastUpdate.getMinutes()}:${lastUpdate.getSeconds()}`;
    let html = `<h3>${form.form_name}</h3><small><em>Last updated: ${lastUpdated}</em></small><hr>`;
    html += formConstructor(form, $);
    $("#form-preview").html(html);
    initTooltips();
  }

  /* ===========================
  ========= INTERFACE ==========
  ============================== */

  // Init libraries
  $(".selectpicker").selectpicker();

  function initTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // Populate app versions dropdown
  const appVersionSelect = $('select[name="app-version"]');
  $.each(appVersions, function (key, version) {
    let selected = appVersion === version ? " selected" : "";
    $(appVersionSelect).append(`<option${selected}>${version}</option>`);
  });

  // Create toast notifications
  function notification(heading, body, type) {
    const randNum = Math.floor(Math.random() * 10000 + 1);
    const randId = `toast-${randNum}`;
    const notification = `<div id="${randId}" class="toast ${type}" role="alert" aria-live="assertive" aria-atomic="true" data-autohide="true" data-delay="500">
      <div class="toast-header">
        <strong class="me-auto">${heading}</strong>
        <small class="text-muted">just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${body}</div>
    </div>`;
    $(".toast-container").append(notification);
    let newToast = $(document).find(`#${randId}`);
    const toast = new bootstrap.Toast(newToast);
    toast.show();
  }

  // Once authenticated, populate the interface
  function populateInterface(username, userData) {
    // Populate user's forms dropdown
    const userFormSelect = $('select[name="user-forms"]');
    $(userFormSelect).find(`option:not(:first-child)`).remove();
    // Clear preview and options
    $("#form-preview, #form-options").html("");
    $.each(userData.forms, function (key, form_id) {
      const formData = getForm(username, form_id);
      const selected = key === 0 ? " selected" : "";
      $(userFormSelect).append(`<option value='${form_id}'${selected}>${formData.form_name}</option>`);
      // Once the first option is loaded, trigger selection to load page contents
      if (selected) {
        $(userFormSelect).change();
      }
    });
  }
  // Change app version
  $('select[name="app-version"]').on("change", function () {
    const version = $(this).val();
    localStorage.setItem("app-version", version);
    window.location.reload();
  });

  // Change username
  $("#login").on("click", function () {
    const newUsername = $('input[name="username"]').val();
    setUser(newUsername);
  });

  // Select form
  $('select[name="user-forms"]').on("change", function () {
    const form_id = $(this).val();
    if (form_id) {
      editForm(localStorage.getItem("username"), form_id);
    }
  });
});
