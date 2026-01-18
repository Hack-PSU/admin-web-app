import React, { FC, useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { EvaIcon } from "components/base";

export interface FilterCategory {
  id: string;
  label: string;
  options: {
    value: string;
    label: string;
  }[];
}

export interface FilterState {
  [categoryId: string]: string[];
}

interface MultiCategoryFilterProps {
  categories: FilterCategory[];
  filterState: FilterState;
  onFilterChange: (newState: FilterState) => void;
}

const MultiCategoryFilter: FC<MultiCategoryFilterProps> = ({
  categories,
  filterState,
  onFilterChange,
}) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCheckboxChange = (categoryId: string, value: string) => {
    const currentValues = filterState[categoryId] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filterState,
      [categoryId]: newValues,
    });
  };

  const handleSelectAll = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const allValues = category.options.map((o) => o.value);
    const currentValues = filterState[categoryId] || [];
    const allSelected = allValues.every((v) => currentValues.includes(v));

    onFilterChange({
      ...filterState,
      [categoryId]: allSelected ? [] : allValues,
    });
  };

  const handleClearAll = () => {
    const clearedState: FilterState = {};
    categories.forEach((cat) => {
      clearedState[cat.id] = [];
    });
    onFilterChange(clearedState);
  };

  const activeFilterCount = useMemo(() => {
    return Object.values(filterState).reduce(
      (count, values) => count + values.length,
      0
    );
  }, [filterState]);

  const isAllSelected = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return false;
    const currentValues = filterState[categoryId] || [];
    return (
      category.options.length > 0 &&
      category.options.every((o) => currentValues.includes(o.value))
    );
  };

  const isIndeterminate = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return false;
    const currentValues = filterState[categoryId] || [];
    return (
      currentValues.length > 0 && currentValues.length < category.options.length
    );
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          lineHeight: "1.5rem",
          padding: theme.spacing(0.5, 2),
          borderRadius: "10px",
          alignItems: "center",
          backgroundColor: "common.white",
          boxShadow: 1,
          height: "100%",
          minWidth: 120,
          textTransform: "none",
          color: "text.primary",
          "&:hover": {
            backgroundColor: "grey.100",
          },
        }}
        startIcon={
          <Box mt={0.5}>
            <EvaIcon name="funnel-outline" />
          </Box>
        }
        endIcon={
          activeFilterCount > 0 ? (
            <Chip
              label={activeFilterCount}
              size="small"
              color="primary"
              sx={{ height: 20, minWidth: 20, fontSize: 12 }}
            />
          ) : null
        }
      >
        Filters
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 300,
              maxHeight: 500,
              overflow: "auto",
              borderRadius: 2,
              boxShadow: 3,
            },
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Button
                size="small"
                onClick={handleClearAll}
                sx={{ textTransform: "none" }}
              >
                Clear all
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          {categories.map((category, index) => (
            <Box
              key={category.id}
              sx={{ mb: index < categories.length - 1 ? 2 : 0 }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAllSelected(category.id)}
                      indeterminate={isIndeterminate(category.id)}
                      onChange={() => handleSelectAll(category.id)}
                      size="small"
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {category.label}
                    </Typography>
                  }
                  sx={{ mr: 0 }}
                />
              </Box>

              <Box sx={{ pl: 3 }}>
                {category.options.map((option) => (
                  <Box key={option.value}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={(filterState[category.id] || []).includes(
                            option.value
                          )}
                          onChange={() =>
                            handleCheckboxChange(category.id, option.value)
                          }
                          size="small"
                        />
                      }
                      label={
                        <Typography variant="body2">{option.label}</Typography>
                      }
                    />
                  </Box>
                ))}
              </Box>

              {index < categories.length - 1 && <Divider sx={{ mt: 1 }} />}
            </Box>
          ))}
        </Box>
      </Popover>
    </>
  );
};

export default MultiCategoryFilter;
