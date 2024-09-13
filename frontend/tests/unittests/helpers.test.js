import { expect, test } from "vitest";
import getCookie from "../../src/features/helpers";

// i am aware that I technically don't have to test this, but it's a good place to start
test("does get cookie?", () => {
  document.cookie = "testingcookie=It works";
  expect(getCookie("testingcookie")).toBe("It works");
});
