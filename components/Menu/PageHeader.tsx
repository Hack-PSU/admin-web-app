import { FC } from "react";
import { Box, Grid, styled, Typography, IconButton } from "@mui/material";
import { useMenu } from "components/layout";

const BurgerContainer = styled(IconButton)({
  width: 18,
  height: 15,
  position: "relative",
  cursor: "pointer",
  backgroundColor: "transparent",
});

const Layer = styled(Box)(({ theme }) => ({
  width: "100%",
  height: "2px",
  position: "absolute",
  backgroundColor: theme.palette.common.black,
}));

const Burger: FC = () => {
  const { toggleDrawer } = useMenu();

  return (
    <BurgerContainer disableRipple onClick={() => toggleDrawer()}>
      <Layer sx={{ top: 0 }} />
      <Layer sx={{ top: "50%", transform: "translateY(-50%)" }} />
      <Layer sx={{ bottom: 0 }} />
    </BurgerContainer>
  );
};

const PageHeader: FC<{ header: string; right?: JSX.Element }> = ({
  header,
  right,
}) => {
  const { shouldHide } = useMenu();

  return (
    <Grid
      container
      item
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ width: "100%" }}
    >
      {shouldHide ? (
        <Grid item xs={0.5}>
          <Burger />
        </Grid>
      ) : null}
      <Grid item xs={shouldHide ? 9.5 : right ? 10 : 12}>
        <Typography variant={"h4"} sx={{ fontWeight: 700 }}>
          {header}
        </Typography>
      </Grid>
      <Grid item xs={2}>
        {right}
      </Grid>
    </Grid>
  );
};

export default PageHeader;
