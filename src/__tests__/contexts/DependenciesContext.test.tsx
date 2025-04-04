import React, { FunctionComponent, useContext } from "react";
import { DependenciesContext, directAccessToDependencies, IDependencies } from "contexts";
import { render } from "@testing-library/react";

jest.mock("classes", () => {
  return {
    ImapHelper: jest.fn().mockImplementation(() => {
      return {};
    }),
    ImapSocket: jest.fn().mockImplementation(() => {
      return {};
    }),
    SmtpSocket: jest.fn().mockImplementation(() => {
      return {};
    }),
    SecureStorage: jest.fn().mockImplementation(() => {
      return {};
    }),
    StateManager: jest.fn().mockImplementation(() => {
      return {};
    })
  };
});

export const TestComponent: FunctionComponent<{
  getDependenciesContext: (dependenciesContext: IDependencies) => void;
}> = ({ getDependenciesContext }) => {
  const dependenciesContext = useContext(DependenciesContext);

  getDependenciesContext(dependenciesContext);

  return <p>Test Component</p>;
};

describe("Testing DependenciesContext", () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("testing directAccessToDependencies() function", () => {
    const directAccessToDependenciesResponse: IDependencies = directAccessToDependencies();

    expect(directAccessToDependenciesResponse).toEqual({
      imapHelper: {},
      imapSocket: {},
      smtpSocket: {},
      secureStorage: {},
      stateManager: {}
    });
  });

  it("testing useContext(DependenciesContext) function", () => {
    const getDependenciesContext = jest.fn();

    render(<TestComponent getDependenciesContext={getDependenciesContext} />);

    expect(getDependenciesContext).toHaveBeenCalledWith({
      imapHelper: {},
      imapSocket: {},
      smtpSocket: {},
      secureStorage: {},
      stateManager: {}
    });
  });
});
