export const getFirstName = (name) => name.split(' ')[0];
export const isValidPassword = (password) => {
  if (password.length < 8) return false;
  if (password.toLowerCase().includes('password')) return false;

  return true;
};
