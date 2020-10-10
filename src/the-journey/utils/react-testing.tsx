import React from "react";
import { render } from "@testing-library/react";
import { Router, Route } from 'react-router-dom';
import { createMemoryHistory } from "history";
import { FunctionComponent } from 'react';

//
// testing
//
interface RouterProps {
  path?: string,
  route?: string,
  history?: any,
}

export function renderWithRouterMatch(
  ui: FunctionComponent,
  {
    path = "/",
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] })
  }: RouterProps = {}
) {
  return {
    ...render(
      <Router history={history}>
        <Route path={path} component={ui} />
      </Router>
    )
  };
}
