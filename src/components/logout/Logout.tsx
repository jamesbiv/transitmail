import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { ImapSocket, SmtpSocket } from "class";

interface ILogoutProps {
  dependencies: {
    imapSocket: ImapSocket;
    smtpSocket: SmtpSocket;
  };
}

export const Logout: React.FC<ILogoutProps> = ({ dependencies }) => {
  useEffect(() => {
    // discomnect from both imap and smtp (if needed)
  }, []);

  return (
    <div className="mt-4">
      <h4>
        <FontAwesomeIcon icon={faSignOutAlt} /> You have successfully logged
        out!
      </h4>
      <ul>
        <li>Your connection to the mail server has been closed.</li>
        <li>
          If you would like to login and check email, please visit <b>Inbox</b>{" "}
          or <b>Folders</b>.
        </li>{" "}
      </ul>
    </div>
  );
};
