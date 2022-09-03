import { FC } from "react";
import { DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DefaultCell from "./DefaultCell";

type Props = {
  dragHandleProps: DraggableProvidedDragHandleProps | undefined;
};

const DefaultDragHandleCell: FC<Props> = ({ dragHandleProps }) => {
  return (
    <DefaultCell
      disableDefault
      sx={{
        width: "1%",
        whiteSpace: "nowrap",
        p: 0,
        pt: 0.5,
      }}
      {...dragHandleProps}
    >
      <DragIndicatorIcon fontSize={"medium"} />
    </DefaultCell>
  );
};

export default DefaultDragHandleCell;
