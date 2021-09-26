// Construct a form layout
export function formConstructor(form, $) {
  // Grab form data
  const groups = form.groups;
  const fields = form.fields;

  // Start creating the HTML
  const endpoint = form.custom_endpoint ? form.custom_endpoint : `${appRoot}langs/${appVersion}/${ajaxEndpoints[appVersion]["test"]}`;
  let html = `<form id='${form.form_id}' class='test-form' action='${endpoint}' action='post'><div class="row">`;
  let inlineScript = `<script>jQuery(document).ready(function($){`;

  // Loop through groups
  $.each(groups, function (group_id, group) {
    const custom_classes = group.custom_classes ? ` ${group.custom_classes}` : "";
    html += `<div id='${group_id}' class='col-md-${group.width} order-${group.order}${custom_classes}'>`;
    // Loop through fields
    $.each(group.fields, function (key, field_id) {
      html += createField(field_id, fields[field_id]);
      inlineScript += fieldScript(field_id, fields[field_id]["script"]);
    });
    html += "</div>";
  });

  inlineScript += "});</script>";
  html += `</div><div class='response'></div><script src='${appRoot}assets/js/form.js'></script></form>`;

  // Return the HTML
  const jsonData = JSON.stringify(form, null, 2);
  return `${html + inlineScript}<hr><p><strong>Form JSON:</strong></p><code><pre>${jsonData}</pre></code>`;

  // Create a single form field
  function createField(field_id, field) {
    let html,
      classes,
      messages = "";

    // Create HTML elements based on data
    const fieldTag = field.tag;
    const placeholder = field.placeholder ? ` placeholder='${field.placeholder}'` : "";
    const name = ` name='${field_id}'`;
    const required = field.required ? " required" : "";
    const help = field.help ? `<span data-bs-toggle='tooltip' data-bs-placement='${field.tooltip_position}' title='${field.help}'><i class='fas fa-question-circle ms-1'></i></span>` : "";
    const label = field.label ? `<label for='${field_id}' class='form-label'>${field.label}${required ? ` <small>*</small>` : ``}${help ? help : ``}</label>` : "";
    const size = field.size ? `${field.size}` : "";
    const color = field.color ? `${field.color}` : "";
    const value = field.value ? ` value='${field.value}'` : "";
    const pattern = field.pattern ? ` data-pattern='${field.pattern}'` : "";
    // If present, add data messages
    if (field.messages) {
      $.each(field.messages, function (check, message) {
        messages = ` data-${check} = "${message}"`;
      });
    }

    switch (fieldTag) {
      // Input fields
      case "input":
        classes = ` class='form-control${size ? ` input-${size}` : ""}${field.custom_classes ? ` ${field.custom_classes}` : ""}'`;
        html = `${label}<input type='${field.type}'${classes}${name}${placeholder}${value}${messages}${pattern}${required}>`;
        break;
      // Buttons
      case "button":
        classes = ` class='btn btn-${size} btn-${color}${field.custom_classes ? ` ${field.custom_classes}` : ""}'`;
        html = `${label}<button type='${field.type}'${classes}${name}>${field.value}</button>`;
        break;
    }

    return html;
  }

  // Add field's script to form's inline script
  function fieldScript(field_id, field_script) {
    return "";
  }
}
