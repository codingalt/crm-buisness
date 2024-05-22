import { format } from "timeago.js";

 const formatTimestamp = (timestamp) => {
   const now = new Date();
   const messageTime = new Date(timestamp);
   const timeDiff = Math.floor((now - messageTime) / 1000);

   if (timeDiff < 60) {
     return "just now";
   } else {
     return format(timestamp);
   }
 };

export default formatTimestamp;
