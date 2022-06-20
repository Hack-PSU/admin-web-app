import { alpha, Theme } from "@mui/material";
import { GroupBase, StylesConfig } from "react-select";

export const selectStyles: <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>(
  theme: Theme,
  error?: boolean
) => StylesConfig<TOption, TIsMulti, TGroup> = (theme, error) => ({
  placeholder: (provided) => ({
    ...provided,
    color: alpha(theme.palette.border.dark, 0.8),
    fontSize: "0.85rem",
    fontFamily: "Poppins",
    fontWeight: "normal",
  }),
  control: (provided, state) => ({
    ...provided,
    cursor: "text",
    borderColor: !error
      ? state.isFocused
        ? theme.palette.sunset.light
        : theme.palette.border.light
      : theme.palette.error.main,
    borderWidth: 2,
    boxShadow: state.isFocused
      ? `0 0 0 0.125rem ${alpha(theme.palette.sunset.dark, 0.3)}`
      : undefined,
    ":hover": {
      borderColor: theme.palette.sunset.light,
    },
    borderRadius: "15px",
    padding: theme.spacing(0.3, 1),
    transition: "border-color 100ms ease-in-out",
    fontSize: "0.9rem",
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: 0,
    background: state.isSelected ? theme.palette.border.light : "transparent",
    color: state.isSelected
      ? theme.palette.common.black
      : alpha(theme.palette.common.black, 0.7),
    transition: "all 200ms ease-in-out",
    cursor: "pointer",
    ":hover": {
      backgroundColor: state.isSelected
        ? theme.palette.border.light
        : alpha(theme.palette.border.light, 0.8),
      color: theme.palette.common.black,
    },
    padding: theme.spacing(1.3, 2),
    borderRadius: "5px",
    ":not(:first-child)": {
      marginTop: theme.spacing(0.8),
    },
    fontWeight: 500,
  }),
  menuList: (provided) => ({
    ...provided,
    padding: theme.spacing(2),
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: theme.shadows[1],
    borderRadius: "15px",
    overflow: "hidden",
    zIndex: 99,
  }),
});
