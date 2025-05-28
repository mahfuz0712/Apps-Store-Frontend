function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>😓 Oops! Something blew up:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
export default ErrorFallback;