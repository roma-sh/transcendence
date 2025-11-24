function isValidEmail(email) {
	if (typeof email !== "string") return false;

	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
	return regex.test(email.toLowerCase());
  }

  function isStrongPassword(password) {
	if (typeof password !== "string") return false;

	const regex =
	  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(){}\[\]<>?/|~_-]).{8,}$/;

	return regex.test(password);
  }

  function isValidUsername(username) {
	if (typeof username !== "string") return false;

	const regex = /^[A-Za-z0-9_]{3,}$/;
	return regex.test(username);
  }

  module.exports = { isValidEmail, isStrongPassword, isValidUsername };


  // Validation rules:
// - Email: must follow standard email format (text@domain.ext)
// - Username: at least 3 characters, only letters, numbers, or underscores
// - Password: minimum 8 characters, must include uppercase, lowercase, number, and at least one special character
