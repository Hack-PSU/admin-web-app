import React from "react";

export interface IBaseErrorProps {
  error: string;
}

export interface IErrorBoundaryProps {
  component?: React.FC<IBaseErrorProps>;
}

export interface IErrorBoundaryStates {
  hasError: boolean;
  error: string;
}
