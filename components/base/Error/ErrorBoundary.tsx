import React from "react";
import { IErrorBoundaryProps, IErrorBoundaryStates } from "types/components";
import DefaultError from "./DefaultError";
import { WithChildren } from 'types/common';
import UnauthorizedError from "components/base/Error/UnauthorizedError";

class ErrorBoundary extends React.Component<WithChildren<IErrorBoundaryProps>, IErrorBoundaryStates> {
  constructor(props: WithChildren<IErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false, error: "" };
  }

  static getDerivedStateFromError(error: Error) {
    console.log(error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log({ error, errorInfo });
  }

  render() {
    console.log(this.state);
    if (this.state.hasError) {
      if (this.props.component) {
        const Component = this.props.component;
        return <Component error={this.state.error} />;
      } else if (this.state.error && this.state.error === "unauthorized") {
        return <UnauthorizedError error={this.state.error} />;
      }
      return <DefaultError error={this.state.error} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;