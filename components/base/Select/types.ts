export interface ISelectItem<T = any> {
  value: T;
  type?: "option" | "button";
  display: string;
}

export interface IOption<TValue = string> {
  readonly label: string;
  readonly value: TValue;
  readonly isNew?: boolean;
}
