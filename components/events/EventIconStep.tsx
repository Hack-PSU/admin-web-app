import React, { FC, useCallback } from "react";
import EventStep from "./EventStep";
import { Grid, Typography, Box } from "@mui/material";
import { useStepper } from "components/base";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useEventStore } from "common/store";
import { EventType } from "api";

type FormData = {
  icon?: File;
};

const EventIconStep: FC = () => {
  const { type, icon, updateIcon } = useEventStore();

  const methods = useForm<FormData>({
    defaultValues: {
      icon,
    },
  });

  const { nextStep, active, previousStep, gotoStep } = useStepper(3, "4. Event Icon");

  const handleClickPrevious = useCallback(() => {
    if (type && type.value !== EventType.WORKSHOP) {
      gotoStep(1, 2);
    } else {
      previousStep();
    }
  }, [type, gotoStep, previousStep]);

  const handleNext = useCallback(() => {
    methods.handleSubmit((data) => {
      updateIcon(data.icon);
      nextStep();
    })();
  }, [methods, nextStep, updateIcon]);

  return (
    <FormProvider {...methods}>
      <EventStep
        title="Event Icon"
        handleNext={handleNext}
        active={active}
        handlePrevious={handleClickPrevious}
        handleNextTitle="Continue to Review"
      >
        <Grid container item spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload an icon for your event (optional). This will be displayed alongside your event information.
            </Typography>
            <Controller
              name="icon"
              control={methods.control}
              render={({ field: { onChange, value } }) => {
                const { getRootProps, getInputProps, isDragActive } = useDropzone({
                  onDrop: (files) => {
                    if (files.length > 0) {
                      onChange(files[0]);
                    }
                  },
                  accept: {
                    'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg']
                  },
                  maxFiles: 1,
                });

                return (
                  <Box
                    {...getRootProps()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isDragActive ? 'primary.main' : 'border.light',
                      borderRadius: '15px',
                      padding: 4,
                      textAlign: 'center',
                      cursor: 'pointer',
                      backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    {value ? (
                      <Typography>
                        Selected: {value.name}
                      </Typography>
                    ) : isDragActive ? (
                      <Typography>Drop the file here...</Typography>
                    ) : (
                      <Typography>
                        Drag and drop an image file here, or click to select
                      </Typography>
                    )}
                  </Box>
                );
              }}
            />
          </Grid>
        </Grid>
      </EventStep>
    </FormProvider>
  );
};

export default EventIconStep;