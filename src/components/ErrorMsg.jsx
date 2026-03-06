export default function ErrorMsg({ message }) {
  const isNetwork =
    message &&
    (message.toLowerCase().includes('network') ||
      message.toLowerCase().includes('cors') ||
      message.toLowerCase().includes('failed'));

  return (
    <div className="error-msg">
      <span>{isNetwork ? '🌐' : '⚠️'}</span>
      <p>
        {isNetwork
          ? 'Unable to reach the server. Check your connection or try again later.'
          : message || 'Something went wrong. Please try again.'}
      </p>
      {message && <code className="error-msg__detail">{message}</code>}
    </div>
  );
}
