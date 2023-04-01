// import React, { FC, useMemo } from "react";
// import { useModal } from "components/context";
// import {
//   Button,
//   ControlledInput,
//   ControlledSelect,
//   LabelledInput,
//   LabelledSelect,
//   Modal,
// } from "components/base";
// import { useForm, FormProvider } from "react-hook-form";
// import { Grid } from "@mui/material";
// import { object, refine, string, union } from "superstruct";
// import {
//   Email,
//   FormErrorCode,
//   NonEmptyNumber,
//   NonEmptySelect,
// } from "common/form";
// import { superstructResolver } from "@hookform/resolvers/superstruct";
//
// // @ts-ignore
// import isEmail from "is-email";
// import { useQuery } from "@tanstack/react-query";
// import { fetch, getAllAvailableItems, getAllHackers, QueryKeys } from "api";
// import { IOption } from "types/components";
//
// const schema = object({
//   checkoutItem: NonEmptySelect,
//   quantity: NonEmptyNumber,
//   userInfo: refine(
//     union([Email, string()]),
//     "NonEmptyUnion",
//     (value) => isEmail(value) || !!value || FormErrorCode.empty
//   ),
// });
//
// const AddCheckoutModal: FC = () => {
//   const { show, handleHide } = useModal("addCheckout");
//   const methods = useForm({
//     defaultValues: {
//       checkoutItem: [],
//       quantity: 0,
//       userInfo: "",
//     },
//     resolver: superstructResolver(schema),
//   });
//
//   const { data: availableItems } = useQuery(
//     QueryKeys.manageItems.findAll(),
//     () => fetch(getAllAvailableItems),
//     {
//       select: (data) => {
//         if (data) {
//           return data.map((d) => ({
//             uid: d.uid,
//             name: d.name,
//           }));
//         }
//       },
//     }
//   );
//
//   const { data: allUsers } = useQuery(QueryKeys.hacker.findAll(), () =>
//     fetch(getAllHackers)
//   );
//
//   const itemsOptions = useMemo(() => {
//     if (availableItems) {
//       return availableItems.map((item) => ({
//         value: item.uid,
//         label: item.name,
//       }));
//     }
//   }, [availableItems]);
//
//   const userOptions = useMemo(() => {
//     if (allUsers) {
//       return allUsers.map((u) => ({
//         value: u.uid,
//         label: `${u.firstname} ${u.lastname} [${u.pin}]`,
//       }));
//     }
//   }, [allUsers]);
//
//   const onSubmit = () => {
//     methods.handleSubmit((data) => {
//       console.log(data);
//     })();
//   };
//
//   return (
//     <Modal open={show} onClose={handleHide}>
//       <FormProvider {...methods}>
//         <Modal.Header>Create Checkout Request</Modal.Header>
//         <Modal.Body>
//           <Grid container item spacing={1} justifyContent="center">
//             <Grid item xs={12}>
//               <ControlledSelect
//                 name={"checkoutItem"}
//                 as={LabelledSelect}
//                 id={"checkout-items"}
//                 label={"Item"}
//                 options={itemsOptions}
//                 placeholder={"Select an item"}
//                 showError
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <ControlledSelect
//                 name={"userInfo"}
//                 placeholder={"Enter user pin or email"}
//                 as={LabelledSelect}
//                 id={"user-info"}
//                 label={"User"}
//                 options={userOptions}
//                 showError
//               />
//             </Grid>
//             <Grid item xs={3}>
//               <Button
//                 onClick={onSubmit}
//                 sx={{
//                   width: "100%",
//                   mt: 2,
//                 }}
//               >
//                 Submit
//               </Button>
//             </Grid>
//           </Grid>
//         </Modal.Body>
//       </FormProvider>
//     </Modal>
//   );
// };
//
// export default AddCheckoutModal;
