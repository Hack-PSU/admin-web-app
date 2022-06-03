import React, { FC, forwardRef, useState } from "react";
import {
  ControlledSelectProps,
  ISelectItem,
  ISelectProps,
  LabelledSelectProps,
} from "types/components";
import { EvaIcon } from "components/base";
import { Input, InputLabel } from "components/base/Input";
import { Box, InputAdornment, Menu, MenuItem } from "@mui/material";
import { useTheme } from "@mui/system";
import { useController } from "react-hook-form";
import BaseMenuItem from "components/base/Select/BaseMenuItem";

const ChevronDown: FC = () => (
  <EvaIcon name={"chevron-down-outline"} size="large" fill="#000" />
);

const ChevronUp: FC = () => (
  <EvaIcon name={"chevron-up-outline"} size="large" fill="#000" />
);

const SelectAdornment: FC<{ open: boolean }> = ({ open }) => (
  <InputAdornment position={"end"}>
    <Box mt={0.5}>{open ? <ChevronUp /> : <ChevronDown />}</Box>
  </InputAdornment>
);

const Select = forwardRef<any, ISelectProps>(
  (
    {
      placeholder,
      items,
      renderItem,
      menuStyle,
      selectStyle,
      menuWidth,
      value,
      onChange,
      onBlur,
      selectInputStyle,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const toggleMenu = () => {
      setIsOpen((open) => !open);
    };

    const onClickInput = (event: any) => {
      setAnchorEl(event.currentTarget);
      toggleMenu();
    };

    const onChangeItem = (event: any, item: ISelectItem) => {
      toggleMenu();
      if (onChange) {
        onChange(item);
      }
    };

    const theme = useTheme();

    const selectColor = value
      ? theme.palette.select.main
      : theme.palette.select.placeholder;

    return (
      <>
        <Input
          placeholder={placeholder}
          disabled
          endAdornment={<SelectAdornment open={isOpen} />}
          onClick={onClickInput}
          ref={ref}
          onBlur={onBlur}
          inputProps={{
            style: {
              WebkitTextFillColor: selectColor,
              ...selectInputStyle,
            },
          }}
          sx={{
            width: "100%",
            "&& > input.MuiInputBase-input.Mui-disabled": {
              color: selectColor,
              WebkitTextFillColor: selectColor,
            },
            ...selectStyle,
          }}
          // @ts-ignore
          value={value ? value.display : placeholder}
          defaultValue=""
          {...props}
        />
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          keepMounted
          onClose={toggleMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          sx={menuStyle}
          PaperProps={{
            style: { width: menuWidth ?? "100%" },
            sx: { boxShadow: 1 },
          }}
        >
          {items.map((item, index) => {
            if (renderItem) {
              return renderItem({ item, index });
            } else {
              return (
                <BaseMenuItem
                  key={`${item.value}-${item.display}-${index}`}
                  item={item}
                  onChangeItem={onChangeItem}
                  index={index}
                />
              );
            }
          })}
        </Menu>
      </>
    );
  }
);
Select.displayName = "Select";

export const LabelledSelect: FC<LabelledSelectProps> = ({
  id,
  label,
  showError,
  error,
  placeholder,
  items,
  renderItem,
  ...props
}) => {
  return (
    <>
      <InputLabel id={id} label={label} showError={showError} error={error} />
      <Select
        placeholder={placeholder}
        items={items}
        renderItem={renderItem}
        {...props}
      />
    </>
  );
};

export const ControlledSelect: FC<ControlledSelectProps> = ({
  as: Component,
  placeholder,
  name,
  rules,
  defaultValue,
  items,
  renderItem,
  ...props
}) => {
  const {
    field: { onChange, onBlur, value, ref },
  } = useController({
    name,
    rules,
    defaultValue: defaultValue ?? undefined,
  });

  if (Component) {
    return (
      <Component
        placeholder={placeholder}
        items={items}
        renderItem={renderItem}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        {...props}
      />
    );
  }

  return (
    <Select
      placeholder={placeholder}
      items={items}
      renderItem={renderItem}
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      value={value}
      defaultValue={placeholder}
      {...props}
    />
  );
};

export default Select;
