import {
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";
import Page from "../../src/routes/Page";
import { Provider } from "react-redux";
import store from "../../src/features/authStore/store";
import server from "../setup";
import { HttpResponse, http } from "msw";
import { MemoryRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../../src/containers/Login";

describe("Page", () => {
  it("returns children when public with unauthenticated client", async () => {
    server.use(
      http.get("/api/accounts/is-authenticated", () => {
        return HttpResponse.json({
          is_authenticated: false,
          is_mod: false,
          is_admin: false,
          is_superuser: false,
        });
      }),
    );
    render(
      <Provider store={store}>
        <Page title={"my page"} type={"public"}>
          <p>Hello world!</p>
        </Page>
      </Provider>,
    );

    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    expect(screen.getByRole("paragraph")).toHaveTextContent("Hello world!");
  });
  it("returns children when private with authenticated client", async () => {
    server.use(
      http.get("/api/accounts/is-authenticated", () => {
        return HttpResponse.json({
          is_authenticated: true,
          is_mod: false,
          is_admin: false,
          is_superuser: false,
        });
      }),
    );
    render(
      <Provider store={store}>
        <Page title={"my page"} type={"private"}>
          <p>Hello world!</p>
        </Page>
      </Provider>,
    );
    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));

    expect(screen.getByRole("paragraph")).toHaveTextContent("Hello world!");
  });
  it("redirects to login when private with unauthenticated client", async () => {
    server.use(
      http.get("/api/accounts/is-authenticated", () => {
        return HttpResponse.json({
          is_authenticated: false,
          is_mod: false,
          is_admin: false,
          is_superuser: false,
        });
      }),
    );
    // prot = protected
    render(
      <Provider store={store}>
        <Router initialEntries={["/prot"]}>
          <Routes>
            <Route
              path="/prot"
              element={
                <Page title={"my page"} type={"private"}>
                  <p>Hello world!</p>
                </Page>
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Provider>,
    );
    await waitFor(() => screen.getByRole("form"));

    expect(screen.getByRole("form")).toBeVisible();
  });
});
