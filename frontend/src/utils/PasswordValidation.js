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

export const passwordErrorHandler = (
  password,
  confirmation,
  setErrMsg,
  validator = validatePassword,
  pwdNotidentical = 'Les mots de passe ne sont pas identiques',
  pwdExplanation = "Le mot de passe doit respecter les instructions suivantes : \n" +
    " - Contenir au moins 8 caractères. \n" +
    "Et satisfaire trois des condtions suivantes : \n" +
    "   - Inclure une lettre majuscule.\n" +
    "   - Inclure une lettre minuscule.\n" +
    "   - Contenir au moins un chiffre.\n" +
    "   - Inclure un caractère spécial."

) => {


  setErrMsg('');

  if (password !== confirmation) {
    setErrMsg(pwdNotidentical);
    return false;
  }

  if (!validator(password)) {

    setErrMsg(pwdExplanation);
    return false;
  }
}