import React, { FC, useState } from "react";
import { WithChildren } from "types/common";

interface IMenuItemProps {
  icon: string;
  label: string;
  to: string;
}

const CollapsibleMenuItem: FC<WithChildren<IMenuItemProps>> = ({
  children,
  icon,
  label,
  to,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpenItem = () => {
    setIsOpen((open) => !open);
  };

  return <></>;
};

export default CollapsibleMenuItem;
