import React, { FC, forwardRef, useState } from "react";
import {
  ControlledSelectProps,
  ISelectItem,
  ISelectProps,
  LabelledSelectProps,
} from "types/components";
import { EvaIcon } from "components/base";
import { Input, InputLabel } from "components/base/Input";
import { Box, InputAdornment, Menu } from "@mui/material";
import { useTheme } from "@mui/system";
import { useController } from "react-hook-form";
import BaseMenuItem from "./BaseMenuItem";

const ChevronDown: FC = () => (
  <EvaIcon name={"chevron-down-outline"} size="large" fill="#000" />
);

const ChevronUp: FC = () => (
  <EvaIcon name={"chevron-up-outline"} size="large" fill="#000" />
);

const SelectAdornment: FC<{ open: boolean }> = ({ open }) => (
  <InputAdornment position={"end"} style={{ cursor: "pointer" }}>
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
      menuWidth,
      value,
      onChange,
      onBlur,
      selectInputStyle,
      sx,
      ...props
    },
    ref
  ) => {
    console.log(sx);
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
              cursor: "pointer",
              ...selectInputStyle,
            },
          }}
          sx={{
            width: "100%",
            borderRadius: "15px",
            "&& > input.MuiInputBase-input.Mui-disabled": {
              color: selectColor,
              WebkitTextFillColor: selectColor,
            },
            ...sx,
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
              return renderItem({ item, index, onChange: onChangeItem });
            } else {
              return (
                <BaseMenuItem
                  key={`${item.value}-${item.display}-${index}`}
                  item={item}
                  onChangeItem={onChangeItem}
                >
                  {item.display}
                </BaseMenuItem>
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
  console.log(props.sx);
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
        onChange={onChange}
        onBlur={onBlur}
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
