import { FC } from "react";
import { Box, Grid, styled, Typography } from "@mui/material";
import { useMenu } from "components/layout";

const BurgerContainer = styled(Box)({
  width: 30,
  height: 30,
  position: "relative",
});

const Layer = styled(Box)({
  width: "100%",
  height: "2px",
  position: "absolute",
});

const Burger: FC = () => {
  return (
    <BurgerContainer>
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
        <Grid item xs={2}>
          <Burger />
        </Grid>
      ) : null}
      <Grid item xs={shouldHide ? 8 : right ? 10 : 12}>
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
