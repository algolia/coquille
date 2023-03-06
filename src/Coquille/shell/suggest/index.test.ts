import { describe, expect, it } from "vitest";
import suggest from ".";
import { commands } from "../mock";

describe("suggest", () => {
  it.each([
    // ✅ With suggestion
    ["Root command suggestion", "a", [{ name: "algolia", description: "" }]],
    [
      "Command suggestion",
      "algolia indices config ",
      [
        { name: "export", description: "algolia config export description" },
        { name: "import", description: "algolia config import description" },
      ],
    ],
    [
      "Command and flags suggestion",
      "algolia indices ",
      [
        { name: "config", description: "" },
        { name: "--clear", alias: "-c", description: "Clear index" },
      ],
    ],
    [
      "Flags suggestion",
      "algolia indices config import ARG ",
      [
        {
          name: "--scope",
          alias: "-s",
          description: "scope flag description",
        },
        {
          name: "--forward-to-replicas",
          alias: "-f",
          description: "Forward config import to replicas",
        },
      ],
    ],
    [
      "Flags suggestion with one flag already passed",
      "algolia indices config import --scope rules ",
      [
        {
          name: "--forward-to-replicas",
          alias: "-f",
          description: "Forward config import to replicas",
        },
      ],
    ],
    [
      "Flag suggestion with dash",
      "algolia indices config import ARG -",
      [
        {
          name: "--scope",
          alias: "-s",
          description: "scope flag description",
        },
        {
          name: "--forward-to-replicas",
          alias: "-f",
          description: "Forward config import to replicas",
        },
      ],
    ],
    [
      "Flag suggestion (filtered)",
      "algolia indices config export ARG1 ARG2 ARG3 --s",
      [
        {
          name: "--scope",
          alias: "-s",
          description: "scope flag description",
        },
      ],
    ],
    [
      "Flag suggestion after enough args",
      "algolia indices config export ARG1 ARG2 ARG3 ",
      [
        {
          name: "--scope",
          alias: "-s",
          description: "scope flag description",
        },
      ],
    ],
    [
      "Flag value suggestion",
      "algolia indices config export --scope ",
      [
        { name: "synonyms", description: "synonyms description" },
        { name: "rules", description: "rules description" },
        { name: "settings", description: "settings description" },
      ],
    ],
    [
      "Flag values suggestion (multiple)",
      "algolia indices config export --scope synonyms,",
      [
        { name: "rules", description: "rules description" },
        { name: "settings", description: "settings description" },
      ],
    ],
    [
      "Flag values suggestion (multiple and filtered)",
      "algolia indices config export --scope synonyms,ru",
      [{ name: "rules", description: "rules description" }],
    ],
    [
      "Flag value suggestion (filtered)",
      "algolia indices config export --scope s",
      [
        { name: "synonyms", description: "synonyms description" },
        { name: "settings", description: "settings description" },
      ],
    ],
    [
      "First arg suggestion (filtered)",
      "algolia indices config export A",
      [
        { name: "ARG1", description: "Arg1 description" },
        { name: "ARG2", description: "Arg2 description" },
        { name: "ARG3", description: "Arg3 description" },
      ],
    ],
    [
      "Second arg suggestion (filtered)",
      "algolia indices config export ARG1 A",
      [
        { name: "ARG2", description: "Arg2 description" },
        { name: "ARG3", description: "Arg3 description" },
      ],
    ],
    // ❌ No suggestion
    ["Unknown root command", "indices config export --scope s", null],
    ["Unknown root command (filter)", "z", null],
    [
      "Unknown sub command",
      "algolia test indices config export --scope s",
      null,
    ],
    ["Unknown flag name", "algolia test indices config export --a", null],
    [
      "Unknown flag value",
      "algolia test indices config export --scope h",
      null,
    ],
    ["Unknown arg", "algolia indices config export Z", null],
    ["Arg after flag", "algolia indices config export --scope rules AR", null],
    ["Arg required before flags", "algolia indices config import ", null],
    [
      "Arg required before flags (hyphen)",
      "algolia indices config export -",
      null,
    ],
    [
      "Multiple args required before flags",
      "algolia indices config export ARG1 --s",
      null,
    ],
  ])("%s", (_, fullCommand, expectedValue) => {
    const result = suggest(fullCommand, commands);

    expect(result).toStrictEqual(expectedValue);
  });
});
