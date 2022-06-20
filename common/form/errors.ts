export enum FormErrorCode {
  empty = "input/empty",
}

export const parseFormError = (error: FormErrorCode, name?: string) => {
  switch (error) {
    case FormErrorCode.empty:
      return `${name ?? "Input"} is required`;
  }
};
