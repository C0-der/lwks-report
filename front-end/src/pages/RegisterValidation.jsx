
function Validation(values) {
    const errors = {};

    const Username_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;

    if (!values.username || values.username.trim() === "") {
        errors.username = "Username cannot be empty";
    } else if (!Username_pattern.test(values.username)) {
        errors.username = "Username must be a valid email";
    } else {
        errors.username = "";
    }

    if (!values.firstname || values.firstname.trim() === "") {
        errors.firstname = "Firstname cannot be empty";
    } else {
        errors.firstname = "";
    }

    if (!values.lastname || values.lastname.trim() === "") {
        errors.lastname = "Lastname cannot be empty";
    } else {
        errors.lastname = "";
    }

    if (!values.password) {
        errors.password = "Password should not be empty";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Password must be 8+ chars, include upper, lower and number";
    } else {
        errors.password = "";
    }

    // Removed confirmPassword and date validations
    if (!values.role) {
        errors.role = "Role is required";
    } else {
        const validRoles = ['student', 'lecture', 'principal', 'program-leader'];
        if (!validRoles.includes(values.role.toLowerCase().trim())) {
            errors.role = "Role must be one of: student, lecture, principal, program-leader";
        } else {
            errors.role = "";
        }
    }


    return errors;
}

export default Validation;