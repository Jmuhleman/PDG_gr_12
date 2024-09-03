export const validatePassword = (pwd) => {
    // Check if password is at least 8 characters long
    if (pwd.length < 8) return false;

    // Define regex patterns for each rule
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumbers = /[0-9]/.test(pwd);
    const hasNonAlphaNumeric = /[^a-zA-Z0-9]/.test(pwd);

    // Count how many rules are met
    const rulesMet = [hasUpperCase, hasLowerCase, hasNumbers, hasNonAlphaNumeric].filter(Boolean).length;

    // Password is valid if at least 3 rules are met
    return rulesMet >= 3;
  };