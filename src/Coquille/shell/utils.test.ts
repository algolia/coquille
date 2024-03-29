import { it, describe, expect } from "vitest";
import { commandToWords, isWordFlagName, sanitizeFlag } from "./utils";

describe("commandToWords", () => {
  it.each([
    ["Root command", `command`, ["command"]],
    [
      "Sub command, flag with value",
      `command sub command --flag value`,
      ["command", "sub", "command", "--flag", "value"],
    ],
    [
      "Sub command, flag with value in double quotation mark",
      `command sub command --flag "a value" --second-flag value`,
      [
        "command",
        "sub",
        "command",
        "--flag",
        "a value",
        "--second-flag",
        "value",
      ],
    ],
    [
      "Sub command, flag with value in single quotation mark",
      `command sub command --flag 'a value' --second-flag value`,
      [
        "command",
        "sub",
        "command",
        "--flag",
        "a value",
        "--second-flag",
        "value",
      ],
    ],
    [
      "Sub command, flag with value in single quotation mark",
      `command sub command --flag 'filter="value in double quotation"' --second-flag value`,
      [
        "command",
        "sub",
        "command",
        "--flag",
        `filter="value in double quotation"`,
        "--second-flag",
        "value",
      ],
    ],
  ])("%s", (_, command, expectedValue) => {
    const result = commandToWords(command);

    expect(result).toEqual(expectedValue);
  });
});

describe("isWordFlagName", () => {
  it.each([
    // ✅ Valid flags
    ["Full flag", "--flag", true],
    ["Shorthand flag", "-f", true],
    ["Shorthand flag", "-f", true],
    // ❌ Wrong flags
    ["Argument", "TEST", false],
    ["command name", "algolia", false],
  ])("%s", (_, word, expectedValue) => {
    const result = isWordFlagName(word);

    expect(result).toBe(expectedValue);
  });
});

describe("sanitizeFlags", () => {
  it.each([
    ["Full flag", "--flag", "flag"],
    ["Shorthand flag", "-f", "f"],
    ["No value", "-", ""],
    ["No value", "--", ""],
    ["Argument", "TEST", "TEST"],
    ["command name", "algolia", "algolia"],
  ])("%s", (_, word, expectedValue) => {
    const result = sanitizeFlag(word);

    expect(result).toBe(expectedValue);
  });
});
