// Debug utility to check authentication state
export const debugAuth = () => {
  console.log('=== AUTH DEBUG ===');
  console.log('Token:', localStorage.getItem('token'));
  console.log('User:', localStorage.getItem('user'));
  console.log('==================');
};
