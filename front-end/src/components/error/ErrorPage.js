import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../ui';

/**
 * Error page component for handling route-level errors
 * Used with React Router's errorElement prop
 */
export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  let errorMessage = 'An unexpected error occurred.';
  let errorDetails = null;

  if (error) {
    if (error.status === 404) {
      errorMessage = 'Page not found';
      errorDetails = "The page you're looking for doesn't exist.";
    } else if (error.status === 500) {
      errorMessage = 'Server error';
      errorDetails =
        'There was a problem with the server. Please try again later.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    // Log error for debugging
    console.error('Route error:', error);
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card border-danger">
            <div className="card-header bg-danger text-white text-center">
              <h2 className="mb-0">
                <i className="oi oi-warning me-2"></i>
                {errorMessage}
              </h2>
            </div>
            <div className="card-body text-center">
              {errorDetails && (
                <p className="card-text text-muted mb-4">{errorDetails}</p>
              )}

              {process.env.NODE_ENV === 'development' && error && (
                <div className="mb-4">
                  <details>
                    <summary className="text-muted">
                      <small>Error Details (Development Only)</small>
                    </summary>
                    <pre
                      className="bg-light p-3 mt-2 text-start"
                      style={{ fontSize: '12px' }}
                    >
                      {JSON.stringify(error, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              <div className="d-flex justify-content-center gap-3">
                <Button variant="primary" onClick={handleGoBack}>
                  <i className="oi oi-arrow-left me-1"></i>
                  Go Back
                </Button>
                <Button variant="outline-secondary" onClick={handleGoHome}>
                  <i className="oi oi-home me-1"></i>
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
