export const setToken = (token) => {
  localStorage.setItem("crmBusinessToken", token);
  const event = new Event("tokenChanged");
  window.dispatchEvent(event);
};

function sendMessageToFlutter(message) {
  if (
    window.LogoutEvent &&
    typeof window.LogoutEvent.postMessage === "function"
  ) {
    window.LogoutEvent.postMessage(message);
  }
}

export const removeToken = () => {
  localStorage.removeItem("crmBusinessToken");
  const event = new Event("tokenChanged");
  window.dispatchEvent(event);

  sendMessageToFlutter("logout");
};
