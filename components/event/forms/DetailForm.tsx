import { FC } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ControlledInput } from "components/base";


const DetailForm: FC = () => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <ControlledInput
        name="name"
        placeholder="Enter event name"
      />
    </FormProvider>
  );
};

export default DetailForm;