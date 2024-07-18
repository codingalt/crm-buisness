export const setToken = (token) => {
  localStorage.setItem("crmBusinessToken", token);
  const event = new Event("tokenChanged");
  window.dispatchEvent(event);
};

export const removeToken = () => {
  localStorage.removeItem("crmBusinessToken");
  const event = new Event("tokenChanged");
  window.dispatchEvent(event);
};
