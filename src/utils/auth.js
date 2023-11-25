export const isAuthenticated = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return !!user;
};
