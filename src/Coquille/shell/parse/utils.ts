import  { ReactNode } from "react";
import { Flag, FlagType } from "../../types";

export const errorObject = (errMsg: ReactNode) => ({
  error: errMsg,
  parsedCommand: undefined,
  run: undefined,
});

export const getFlagNameIfExists = (
  flagName: string,
  flags: { [name: string]: { shorthand?: string } }
): string => {
  // Full flag name
  if (flags[flagName]) {
    return flagName;
  }
  // Shorthand flag name
  for (const flagObject in flags) {
    if (flags[flagObject].shorthand === flagName) {
      return flagObject;
    }
  }
  return "";
};

export const getValueType = (
  value: string
): "string" | "boolean" | "number" => {
  if (["true", "false"].includes(value)) {
    return "boolean";
  }
  if (!isNaN(Number(value))) {
    return "number";
  }

  return "string";
};

export const castValueToType = (
  value: string,
  type: "string" | "boolean" | "number"
) => {
  if (type === "boolean") {
    return value === "true";
  }
  if (type === "number") {
    return Number(value);
  }
  return value;
};

export const setTrueValue = (multiple?: boolean) =>
  multiple ? [true as const] : true;

type GetFlagValue = (args: {
  flagName: string;
  flag: Flag;
  value: string;
}) =>
  | [error: null, value: FlagType | FlagType[]]
  | [error: string, value: null];

export const getFlagValue: GetFlagValue = ({ flagName, flag, value }) => {
  const splittedValue = value.split(",");
  if (splittedValue.length > 1 && !flag.multiple) {
    return [`❌ No multiple values expected for flag '${flagName}'`, null];
  }
  const isValueRightType = splittedValue.every(
    (currValue) => getValueType(currValue) === flag.type
  );
  if (!isValueRightType) {
    return [
      `❌ Wrong value for '${flagName}' flag: ${flag.type} value expected`,
      null,
    ];
  }

  const castedValues = splittedValue.map((flagValue) =>
    castValueToType(flagValue, flag.type)
  );

  if (flag.multiple) {
    return [null, castedValues];
  }

  return [null, castedValues[0]];
};
