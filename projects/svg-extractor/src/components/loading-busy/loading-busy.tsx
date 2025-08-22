import "./styles.css";

type LoadingBusyProps = {
  busyMessage: string;
};

function LoadingBusy({ busyMessage }: LoadingBusyProps) {
  return (
    <div className={`busy-overlay ${!busyMessage && "hidden"}`}>
      <span className="spinner" />
      <span className="small">{busyMessage}</span>
    </div>
  );
}

export default LoadingBusy;
