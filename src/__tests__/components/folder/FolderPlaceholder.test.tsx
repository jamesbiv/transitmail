import React from "react";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { FolderPlaceholder } from "components/folder";

describe("FolderPlaceholder Component", () => {
  it("a successful response", () => {
    const { container } = render(<FolderPlaceholder />);

    const placeholderDiv = container.querySelector("div")!;

    expect(placeholderDiv).toHaveStyle("height: 0px");
  });
});
