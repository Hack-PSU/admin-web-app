import { FC } from "react";
import {
  Grid,
  GridProps,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from "@mui/material";
import { WithChildren } from "types/common";

interface ITableHeaderProps extends Omit<GridProps, "style"> {
  header?: boolean;
  textProps?: Omit<TypographyProps, "children">;
  link?: boolean;
  textComponent?: (props: WithChildren) => JSX.Element;
}

export const DefaultCell = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const TableCell: FC<WithChildren<ITableHeaderProps>> = ({
  children,
  textProps,
  header,
  textComponent,
  link,
  sx: gridSx,
  ...props
}) => {
  const { sx, ...rest } = textProps ?? { sx: {} };

  const theme = useTheme();

  return (
    <Grid
      item
      sx={{
        padding: theme.spacing(0, 2, 0, 0),
        ...gridSx,
      }}
      {...props}
    >
      {textComponent ? (
        textComponent({ children })
      ) : (
        <DefaultCell
          variant="body1"
          as={link ? "a" : undefined}
          sx={{
            fontWeight: header ? "bold" : 600,
            color: header ? "table.header" : "common.black",
            ...sx,
          }}
          {...rest}
        >
          {children}
        </DefaultCell>
      )}
    </Grid>
  );
};

export default TableCell;
