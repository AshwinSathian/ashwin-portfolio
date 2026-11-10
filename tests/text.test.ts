import test from "node:test";
import assert from "node:assert/strict";
import { truncate, numberWord, monthYear, longDate } from "../src/lib/text.ts";

test("truncate never cuts mid-word", () => {
  assert.equal(truncate("one two three four", 12), "one two…");
  assert.equal(truncate("short", 12), "short");
});
test("numberWord", () => {
  assert.equal(numberWord(8), "eight");
  assert.equal(numberWord(11), "11");
});
test("dates are timezone-stable", () => {
  assert.equal(longDate("2026-10-13"), "October 13, 2026");
  assert.equal(monthYear("2026-10-13"), "Oct 2026");
});
