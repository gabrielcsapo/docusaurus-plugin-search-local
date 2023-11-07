import { Component, ErrorInfo } from "react";

type ErrorBoundaryProps = {
  children?: JSX.Element | JSX.Element[];
};
export default class ErrorBoundary extends Component<ErrorBoundaryProps> {
  state: {
    hasError: boolean;
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      <>something wrong</>;
    }

    return this.props.children;
  }
}
