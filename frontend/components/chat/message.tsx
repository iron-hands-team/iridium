import type { MessageType } from "@/types/chat";
import { FaUserCircle } from "react-icons/fa";

function Message({ message }: { message: MessageType }) {
  return (
    <div>
      <div>
        <FaUserCircle size={20} />
        {message.user.firstName + " " + message.user.lastName}
      </div>
      <p>{message.text}</p>
    </div>
  );
}

export default Message;
