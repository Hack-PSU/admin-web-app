import { FC, forwardRef } from "react";
import { TextField, Select as SelectBase, styled, MenuItem, Typography, InputBase, alpha } from "@mui/material";
import { ControlledSelectProps, ISelectProps, LabelledSelectProps } from "types/components";
import { useController } from "react-hook-form";
import { InputLabel } from "components/base";

const StyledSelectInput = styled(InputBase)(({ theme }) => ({
  outline: "none",
  padding: theme.spacing(0.5, 2),
  color: theme.palette.common.black,
  border: `2px solid ${theme.palette.common.black}`,
  borderRadius: "15px",
}));

const StyledTextField = styled(SelectBase)(({ theme }) => ({
  color: theme.palette.common.black,
  backgroundColor: "white",
  outline: "none",
  border: "2px solid black",
  "& .MuiInput-select:focus": {
    outline: "none",
  },
}));

const Select = forwardRef<any, ISelectProps>(({ placeholder, items, renderItem, ...props }, ref) => {
  return (
    <StyledTextField
      placeholder={placeholder}
      input={<StyledSelectInput />}
      variant={"outlined"}
      ref={ref}
      defaultValue=""
      {...props}
    >
      <MenuItem key={placeholder} value={placeholder} selected disabled>
        {placeholder}
      </MenuItem>
      {
        items.map((item, index) => {
          if (renderItem) {
            return renderItem({ item, index });
          } else {
            return (
              <MenuItem key={`${item.value}-${index}`} value={item.value}>
                {item.display}
              </MenuItem>
            );
          }
        })
      }
    </StyledTextField>
  );
});
Select.displayName = "Select";

export const LabelledSelect: FC<LabelledSelectProps> =
  ({
     id, label, showError, error,
     placeholder, items, renderItem, ...props
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

export const ControlledSelect: FC<ControlledSelectProps> =
  ({
     placeholder, name, rules, defaultValue,
     items, renderItem, ...props
   }) => {
    const { field: { onChange, onBlur, value, ref } } = useController({
      name,
      rules,
      defaultValue: defaultValue ?? placeholder,
    });

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
