import React, { Fragment } from "react";

import { directAccessToDependencies } from "contexts";
import { IMessageModalState } from "interfaces";

/**
 * @interface IErrorHandlerEvent
 */
interface IErrorHandlerEvent {
  type: string;
  timeStamp: number;
  reason: {
    [key: string]: string | number | boolean;

    message: string;
    stack: string;
  };
}

/**
 * @var {number} showErrorLimit
 */
let showErrorLimit = 10;

/**
 * errorHandler
 * @param {PromiseRejectionEvent | ErrorEvent} event
 * @returns {void}
 */
export const errorHandler = async (event: PromiseRejectionEvent | ErrorEvent) => {
  --showErrorLimit;

  if (showErrorLimit < 0) {
    return;
  }

  const { stateManager } = directAccessToDependencies();

  const jsonParsedEvent: IErrorHandlerEvent = JSON.parse(
    JSON.stringify(event, ["type", "reason", "timeStamp", "stack", "message"])
  );

  const { type, reason } = jsonParsedEvent;

  const messageModalState: IMessageModalState = {
    title: "An error has occured",
    content: (
      <Fragment>
        <p>
          <strong>
            {reason?.message} ({type})
          </strong>
        </p>
        <strong>
          <small>Stack trace</small>
        </strong>
        <br />
        <textarea
          readOnly
          style={{
            fontSize: "12px",
            width: "100%",
            minHeight: "150px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            borderRadius: "5px"
          }}
          defaultValue={reason?.stack}
        ></textarea>
      </Fragment>
    )
  };

  stateManager.showMessageModal(messageModalState);
};
