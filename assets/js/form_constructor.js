// Construct a form layout
export function formConstructor(formData, $) {
  // Grab form data
  const groups = formData.groups;
  const fields = formData.fields;
  // Start creating the HTML
  let html = '<div class="row">';
  let inlineScript = "<script>jQuery(document).ready(function($){/*";
  // Loop through groups
  $.each(groups, function (group_id, group) {
    html += `<div id='${group_id}' class='col-md-${group.width} order-${group.order}'>`;
    // Loop through fields
    $.each(group.fields, function (key, field_id) {
      html += createField(field_id, fields[field_id]);
      inlineScript += fieldScript(field_id, fields[field_id]);
    });
    html += "</div>";
  });
  inlineScript += "*/});</script>";
  html += "</div>";
  // Return the HTML
  const jsonData = JSON.stringify(formData, null, 2);
  return `${html + inlineScript}<hr><code><pre>${jsonData}</pre></code>`;

  // Create a single form field
  function createField(field_id, field_data) {
    let html = "";
    const fieldTag = field_data.tag;
    const value = field_data.value ? ` value='${field_data.value}'` : "";
    const placeholder = field_data.placeholder ? ` placeholder='${field_data.placeholder}'` : "";
    const name = ` name='${field_id}'`;
    const required = field_data.required ? " required" : "";
    const classes = ` class='form-control${field_data.custom_classes ? ` ${field_data.custom_classes}` : ""}'`;
    const help = field_data.help ? `<span data-bs-toggle="tooltip" data-bs-placement="top" title='${field_data.help}'><i class='fas fa-question-circle ms-1'></i></span>` : "";
    const label = field_data.label ? `<label for='${field_id}'>${field_data.label}${required ? ` <small>*</small>` : ``}${help ? help : ``}</label>` : "";
    switch (fieldTag) {
      case "input":
        html += `${label}<input type='${field_data.type}'${classes}${name}${placeholder}${value}${required}>`;
        break;
    }
    return html;
  }

  // Add field's script to form's inline script
  function fieldScript(field_id, field_data) {
    return `
    "format": "(.*)@(.*).(.*)",
    "validation": {
      "empty": "You must enter an email address",
      "format": "Please enter a valid email address"
    },
    "requirements": {
      "fields": false,
      "groups": false
    },
    "unavailable": "hide"`;
  }
}
