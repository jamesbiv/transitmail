import React from "react";

export interface IComponent {
  id: number;
  element: React.FC;
  eventKey: string;
}
