export default function Unauthorized() {
  return (
    <div className="page-wrap-unauthorized">
      <div className="unauthorized-card">
        <h1>Access restricted</h1>
        <p className="unauthorized-lead">
          You do not have permission to open this page with your current role.
        </p>
        <p className="unauthorized-hint">
          If you think this is a mistake, sign in with a different account or
          contact your support administrator.
        </p>
      </div>
    </div>
  );
}
