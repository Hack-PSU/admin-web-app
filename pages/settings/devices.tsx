// import React, { FC } from "react";
// import { NextPage } from "next";
// import { withSettingsLayout } from "components/settings";
// import { Box, Grid, Typography, useTheme } from "@mui/material";
// import { Button, EvaIcon } from "components/base";
//
// const DeviceItem: FC<{
//   icon: string;
//   label: string;
//   description: string;
//   buttonLabel: string;
//   onClick(): void;
// }> = ({ icon, label, description, onClick, buttonLabel }) => {
//   const theme = useTheme();
//
//   return (
//     <Grid item xs={4}>
//       <Grid
//         container
//         sx={{
//           backgroundColor: "common.white",
//           boxShadow: 2,
//           borderRadius: "10px",
//           px: 1.5,
//           py: 2,
//         }}
//         flexDirection={"column"}
//         gap={1.5}
//       >
//         <Grid container item alignItems={"center"}>
//           <Grid
//             container
//             item
//             sx={{
//               background: theme.palette.gradient.angled.accent,
//               borderRadius: "5px",
//               alignItems: "center",
//               justifyContent: "center",
//               width: 35,
//               height: 35,
//               minWidth: 0,
//               mr: 2,
//             }}
//           >
//             <Box pt={0.5}>
//               <EvaIcon
//                 name={icon}
//                 fill={theme.palette.common.white}
//                 size={"large"}
//               />
//             </Box>
//           </Grid>
//           <Grid item>
//             <Typography
//               variant={"h6"}
//               sx={{
//                 fontWeight: 600,
//               }}
//             >
//               {label}
//             </Typography>
//           </Grid>
//         </Grid>
//         <Grid item>
//           <Typography
//             variant={"body1"}
//             sx={{
//               fontSize: "0.8rem",
//               fontWeight: 500,
//             }}
//           >
//             {description}
//           </Typography>
//         </Grid>
//         <Button
//           sx={{
//             px: 2,
//             py: 1,
//             borderRadius: "5px",
//           }}
//           onClick={onClick}
//         >
//           {buttonLabel}
//         </Button>
//       </Grid>
//     </Grid>
//   );
// };
//
// const SettingsDevices: NextPage = () => {
//   return (
//     <Grid container columnSpacing={1.5}>
//       <DeviceItem
//         icon={"refresh-outline"}
//         label={"Refresh Mobile App"}
//         description={
//           "Refreshing the mobile app will prompt the user to refresh any updated data"
//         }
//         buttonLabel={"Refresh"}
//         onClick={() => null}
//       />
//       <DeviceItem
//         icon={"refresh-outline"}
//         label={"Refresh Admin App"}
//         description={
//           "Refreshing the admin app will reset the app to a newer version"
//         }
//         buttonLabel={"Refresh"}
//         onClick={() => null}
//       />
//     </Grid>
//   );
// };
//
// export default withSettingsLayout(SettingsDevices);
