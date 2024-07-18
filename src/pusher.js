import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Make Pusher available globally
window.Pusher = Pusher;
console.log(localStorage.getItem("crmBusinessToken"));

// Configure Echo with Pusher
window.Echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_KEY,
  cluster: "ap1",
  forceTLS: true,
  encrypted: true,
  authEndpoint: import.meta.env.VITE_PUSHER_AUTH,
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("crmBusinessToken")}`,
    },
  },
});