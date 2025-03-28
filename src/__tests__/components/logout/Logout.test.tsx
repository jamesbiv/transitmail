import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Logout } from "components";

describe("Logout Component", () => {
  it("test logout rendering", () => {
    const { getByText } = render(<Logout />);

    expect(getByText(/You have successfully logged out!/i)).toBeTruthy();
  });
});
