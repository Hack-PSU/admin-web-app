import { define } from "superstruct";
import { FormErrorCode } from "./errors";
import { IOption } from "types/components";

// export const validation = {
//   nonEmptyString: refine(string(), "NonEmpty", (value) => value.length > 0 || FormErrorCode.empty),
// };

export const NonEmptyString = define<string>(
  "NonEmptyString",
  (value) => (!!value && (value as string).length > 0) || FormErrorCode.empty
);

export const NonEmptySelect = define<IOption>("NonEmptySelect", (value) => {
  if (!!value) {
    const option = value as IOption;
    return Boolean(!!option.value && !!option.label);
  } else {
    return FormErrorCode.empty;
  }
});

export const NonEmptySelectArray = define<IOption[]>(
  "NonEmptySelectArray",
  (value) => {
    if (value) {
      const arr = value as IOption[];
      if (arr.length > 0) {
        return true;
      } else {
        return FormErrorCode.empty;
      }
    } else {
      return FormErrorCode.empty;
    }
  }
);
