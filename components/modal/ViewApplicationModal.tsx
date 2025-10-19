import { FC } from "react";
import { useModal } from "components/context/ModalProvider";
import { Grid, Box, Typography, Chip, Divider, Link } from "@mui/material";
import { Button, Modal } from "components/base";
import {
  OrganizerApplicationEntity,
  ApplicationStatus,
  OrganizerTeam,
} from "api";

interface IViewApplicationModalProps {
  application: OrganizerApplicationEntity | null;
  onAccept: (id: number, team: OrganizerTeam) => Promise<void>;
  onReject: (id: number, team: OrganizerTeam) => Promise<void>;
}

const getStatusColor = (
  status: ApplicationStatus
): "default" | "warning" | "success" | "error" => {
  switch (status) {
    case ApplicationStatus.PENDING:
      return "warning";
    case ApplicationStatus.ACCEPTED:
      return "success";
    case ApplicationStatus.REJECTED:
      return "error";
    default:
      return "default";
  }
};

const ViewApplicationModal: FC<IViewApplicationModalProps> = ({
  application,
  onAccept,
  onReject,
}) => {
  const { show, handleHide } = useModal("viewApplication");

  if (!application) {
    return null;
  }

  const canAcceptFirst =
    application.firstChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  const canRejectFirst =
    application.firstChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  const canAcceptSecond =
    application.firstChoiceStatus === ApplicationStatus.REJECTED &&
    application.secondChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  const canRejectSecond =
    application.firstChoiceStatus === ApplicationStatus.REJECTED &&
    application.secondChoiceStatus === ApplicationStatus.PENDING &&
    !application.assignedTeam;

  const handleAcceptFirst = async () => {
    await onAccept(application.id, application.firstChoiceTeam as OrganizerTeam);
    handleHide();
  };

  const handleRejectFirst = async () => {
    await onReject(application.id, application.firstChoiceTeam as OrganizerTeam);
    handleHide();
  };

  const handleAcceptSecond = async () => {
    await onAccept(
      application.id,
      application.secondChoiceTeam as OrganizerTeam
    );
    handleHide();
  };

  const handleRejectSecond = async () => {
    await onReject(
      application.id,
      application.secondChoiceTeam as OrganizerTeam
    );
    handleHide();
  };

  return (
    <Modal open={show} onClose={handleHide}>
      <Modal.Header>Application Details</Modal.Header>
      <Modal.Body
        alignItems="flex-start"
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          pr: 1,
        }}
      >
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{application.name}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{application.email}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Year Standing
            </Typography>
            <Typography variant="body1">{application.yearStanding}</Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Major
            </Typography>
            <Typography variant="body1">{application.major}</Typography>
          </Grid>

          {/* Team Preferences */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Team Preferences
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              First Choice Team
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Typography variant="body1">
                {application.firstChoiceTeam}
              </Typography>
              <Chip
                label={application.firstChoiceStatus}
                color={getStatusColor(application.firstChoiceStatus)}
                size="small"
              />
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Second Choice Team
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
              <Typography variant="body1">
                {application.secondChoiceTeam}
              </Typography>
              <Chip
                label={application.secondChoiceStatus}
                color={getStatusColor(application.secondChoiceStatus)}
                size="small"
              />
            </Box>
          </Grid>

          {application.assignedTeam && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Assigned Team
              </Typography>
              <Chip
                label={application.assignedTeam}
                color="success"
                sx={{ mt: 0.5 }}
              />
            </Grid>
          )}

          {/* Application Essays */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Application Essays
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Why do you want to be a member of HackPSU?
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {application.whyHackpsu}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              One new idea for HackPSU
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {application.newIdea}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              What excites you about HackPSU?
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, whiteSpace: "pre-wrap" }}>
              {application.whatExcitesYou}
            </Typography>
          </Grid>

          {/* Resume */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Resume
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Link
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
            >
              View Resume
            </Link>
          </Grid>

          {/* Application Metadata */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Applied On
            </Typography>
            <Typography variant="body1">
              {new Date(application.createdAt).toLocaleString()}
            </Typography>
          </Grid>

          {/* Action Buttons */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {canAcceptFirst && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAcceptFirst}
                  >
                    Accept (1st Choice)
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRejectFirst}
                  >
                    Reject (1st Choice)
                  </Button>
                </>
              )}

              {canAcceptSecond && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleAcceptSecond}
                  >
                    Accept (2nd Choice)
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRejectSecond}
                  >
                    Reject (2nd Choice)
                  </Button>
                </>
              )}

              <Button variant="outlined" onClick={handleHide}>
                Close
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Modal.Body>
    </Modal>
  );
};

export default ViewApplicationModal;
