jQuery(document).ready(function ($) {
  $(document).on("submit", ".test-form", function (e) {
    e.preventDefault();

    // Set defaults
    const form = $(this).attr("id");
    let error = {};

    // Clear previous submissions
    $(document).find(`#${form} .error`).removeClass("error");
    $(document).find(`#${form} .input-error`).hide();
    $(document).find(`#${form} .response`).html("");

    // Regex check pattern for all applicable fields
    const checkPattern = $(this).find("[data-pattern]");
    $.each(checkPattern, function (field) {
      const pattern = $(this).data("pattern");
      const message = $(this).data("format");
      const name = $(this).attr("name");
      const value = $(this).val();
      const regex = new RegExp(pattern);
      let test = regex.exec(value);
      if (!test) error[name] = message;
    });

    // If there are no errors, submit the form via ajax
    if (Object.keys(error).length === 0) {
      $.ajax({
        url: $(this).attr("action"),
        data: $(this).serialize(),
        type: "post",
        complete: function (data) {
          console.log(data);
          $(document).find(`#${form} .response`).html(`<hr><p><strong>Response:</strong></p><code><pre>${data.responseText}</pre></code>`);
        },
      });

      // Append error messages to fields
    } else {
      console.log(error);
      $.each(error, function (field, message) {
        $(`[name='${field}']`).addClass("error").after(`<span class='input-error'>${message}</span>`);
      });
    }
  });
});
