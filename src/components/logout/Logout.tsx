import React, { FunctionComponent, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Card, CardBody } from "react-bootstrap";
import { DependenciesContext } from "contexts";

export const Logout: FunctionComponent = () => {
  const { imapSocket, smtpSocket } = useContext(DependenciesContext);

  useEffect(() => {
    // discomnect from both imap and smtp (if needed)
  }, []);

  return (
    <Card className="mt-0 mt-sm-3">
      <CardBody>
        <h4>
          <FontAwesomeIcon icon={faSignOutAlt} /> You have successfully logged out!
        </h4>
        <ul>
          <li>Your connection to the mail server has been closed.</li>
          <li>
            If you would like to login and check email, please visit <b>Inbox</b> or <b>Folders</b>.
          </li>
        </ul>
      </CardBody>
    </Card>
  );
};
