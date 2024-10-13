export const isAuthenticated = () => {
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("userId");
  }
  return false;
};
