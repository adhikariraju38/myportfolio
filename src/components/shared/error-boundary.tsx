"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error);
    }
  }

  reset = () => this.setState({ error: null });

  override render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.reset);
      return (
        <div className="m-6 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200">
          <p className="mb-2 font-semibold">Something went wrong</p>
          <p className="mb-3 text-xs opacity-80">{this.state.error.message}</p>
          <button
            type="button"
            onClick={this.reset}
            className="rounded-md border border-red-500/60 px-3 py-1.5 text-xs"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
