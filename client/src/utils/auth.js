// client/src/utils/auth.js
export const getToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  };
  