// Validation logic is kept in plain functions so it can be unit-tested in Node
// without a browser. The DOM wiring at the bottom only runs in a browser.

function validateName(value) {
  return String(value).trim().length >= 2;
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
}

function validateMessage(value) {
  return String(value).trim().length >= 10;
}

function validateForm(fields) {
  const errors = {};
  if (!validateName(fields.name)) errors.name = "Please enter your name.";
  if (!validateEmail(fields.email)) errors.email = "Please enter a valid email address.";
  if (!validateMessage(fields.message)) errors.message = "Your message should be at least 10 characters.";
  return errors;
}

if (typeof document !== "undefined") {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(form));
    const errors = validateForm(fields);

    form.querySelectorAll(".error").forEach((el) => {
      el.textContent = errors[el.dataset.for] || "";
    });

    if (Object.keys(errors).length === 0) {
      status.textContent = "Thanks, your message has been recorded.";
      form.reset();
    } else {
      status.textContent = "";
    }
  });
}

if (typeof module !== "undefined") {
  module.exports = { validateName, validateEmail, validateMessage, validateForm };
}
