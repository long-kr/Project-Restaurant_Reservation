import React from "react";
import { Button } from "../ui";

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: null,
			errorInfo: null,
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI
		return {
			hasError: true,
			error,
		};
	}

	componentDidCatch(error, errorInfo) {
		// Log error details
		console.error("ErrorBoundary caught an error:", error, errorInfo);

		this.setState({
			error,
			errorInfo,
		});

		// Log to external service in production
		if (process.env.NODE_ENV === "production") {
			// You can integrate with error reporting services like Sentry here
			console.error("Production error:", {
				error: error.message,
				stack: error.stack,
				componentStack: errorInfo.componentStack,
			});
		}
	}

	handleReset = () => {
		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
		});
	};

	render() {
		if (this.state.hasError) {
			// Custom fallback UI
			if (this.props.fallback) {
				return this.props.fallback;
			}

			// Default fallback UI
			return (
				<div className='container mt-5'>
					<div className='row justify-content-center'>
						<div className='col-md-8'>
							<div className='card border-danger'>
								<div className='card-header bg-danger text-white'>
									<h4 className='mb-0'>
										<i className='oi oi-warning'></i> Something went wrong
									</h4>
								</div>
								<div className='card-body'>
									<p className='card-text'>
										We're sorry, but something unexpected happened. Our team has
										been notified and is working to fix the issue.
									</p>

									{process.env.NODE_ENV === "development" && (
										<div className='mt-3'>
											<details className='mb-3'>
												<summary className='text-muted'>
													<small>Error Details (Development Only)</small>
												</summary>
												<pre
													className='bg-light p-3 mt-2'
													style={{ fontSize: "12px" }}
												>
													<strong>Error:</strong> {this.state.error?.message}
													{this.state.errorInfo?.componentStack && (
														<>
															{"\n\nComponent Stack:"}
															{this.state.errorInfo.componentStack}
														</>
													)}
												</pre>
											</details>
										</div>
									)}

									<div className='d-flex gap-2'>
										<Button
											variant='primary'
											onClick={this.handleReset}
											className='me-2'
										>
											Try Again
										</Button>
										<Button
											variant='outline-secondary'
											onClick={() => window.location.reload()}
										>
											Reload Page
										</Button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
