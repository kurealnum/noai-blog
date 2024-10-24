import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it } from "vitest";
import AdminDashboard from "../../src/containers/AdminDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import server from "../setup";
import { HttpResponse, http } from "msw";
import { Provider } from "react-redux";
import Page from "../../src/routes/Page.jsx";
import store from "../../src/features/authStore/store";
import { RouterProvider, createMemoryRouter } from "react-router-dom";

//describe("Admin Dashboard", () => {
//  it("renders correctly", async () => {
//    server.use(
//      ...[
//        http.get("/api/blog-posts/get-flagged-posts/", () => {
//          return HttpResponse.json([
//            {
//              user: { username: "oscar" },
//              title: "This is another test.",
//              content: "Write your blog post here!",
//              created_date: "2024-10-23T22:36:45.304535Z",
//              updated_date: "2024-10-24T01:16:12.553619Z",
//              flagged: true,
//              is_listicle: false,
//            },
//          ]);
//        }),
//        http.get("/api/blog-posts/get-flagged-comments/", () => {
//          return HttpResponse.json([
//            {
//              user: {
//                username: "deleted",
//                profile_picture: null,
//                approved_ai_usage: false,
//              },
//              reply_to: null,
//              content: "This comment was deleted",
//              created_date: "2024-10-23T23:57:36.380195Z",
//              updated_date: "2024-10-24T00:01:16.319776Z",
//              id: 19,
//              flagged: true,
//            },
//          ]);
//        }),
//        http.get("/api/blog-posts/get-flagged-users/", () => {
//          return HttpResponse.json([
//            [
//              {
//                username: "testuser",
//                email: "catt@gmail.com",
//                first_name: "bob",
//                last_name: "racha",
//                about_me: "I like to code",
//                date_joined: "2024-10-20T13:22:23Z",
//                technical_info: "hacking away",
//                profile_picture: null,
//                approved_ai_usage: false,
//                flagged: true,
//              },
//            ],
//          ]);
//        }),
//        http.get("/api/accounts/is-authenticated", () => {
//          return HttpResponse.json({
//            is_authenticated: true,
//            is_mod: false,
//            is_admin: true,
//            is_superuser: true,
//          });
//        }),
//      ],
//    );
//
//    const routes = [
//      {
//        path: "/admin-dashboard",
//        element: (
//          <Page title={"None"} type={"admin"}>
//            <AdminDashboard />
//          </Page>
//        ),
//      },
//    ];
//
//    const router = createMemoryRouter(routes, {
//      initialIndex: 0,
//      initialEntries: ["/admin-dashboard"],
//    });
//
//    const queryClient = new QueryClient();
//    render(
//      <Provider store={store}>
//        <QueryClientProvider client={queryClient}>
//          <RouterProvider router={router} />
//        </QueryClientProvider>
//      </Provider>,
//    );
//    await waitForElementToBeRemoved(() => screen.getByRole("progressbar"));
//    console.log(screen.debug());
//  });
//});
