import React, { useMemo } from "react";
import SingleSelect, { GroupBase, Props, StylesConfig } from "react-select";
import { alpha, lighten, styled, useTheme } from "@mui/material";

function Select<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>
>(props: Omit<Props<TOption, TIsMulti, TGroup>, "styles">) {
  const theme = useTheme();

  const customStyles: StylesConfig<TOption, TIsMulti, TGroup> = useMemo(
    () => ({
      placeholder: (provided, state) => ({
        ...provided,
        color: theme.palette.border.dark,
        fontSize: "0.85rem",
        fontFamily: "Poppins",
        fontWeight: "normal",
      }),
      control: (provided, state) => ({
        ...provided,
        border: `2px solid ${theme.palette.border.light}`,
        boxShadow: "none",
        ":hover": {
          border: `2px solid ${theme.palette.border.light}`,
        },
        borderRadius: "15px",
        padding: theme.spacing(0.3, 1),
      }),
      option: (provided, state) => ({
        ...provided,
        ":not(:last-child)": {
          borderBottom: `2px solid ${theme.palette.border.light}`,
        },
        background: state.isSelected
          ? theme.palette.gradient.angled.main
          : "transparent",
        ":hover": {
          background: state.isSelected
            ? theme.palette.gradient.angled.main
            : "aliceblue",
        },
        padding: theme.spacing(1.3, 2),
      }),
      menuList: (provided) => ({
        ...provided,
        padding: 0,
      }),
      menu: (provided) => ({
        ...provided,
        boxShadow: theme.shadows[1],
        borderRadius: "15px",
        overflow: "hidden",
      }),
    }),
    [theme]
  );

  return (
    <SingleSelect
      styles={customStyles}
      components={{
        IndicatorSeparator: () => null,
      }}
      {...props}
    />
  );
}

export default Select;
