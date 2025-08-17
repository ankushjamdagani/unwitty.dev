import "./styles.css";

type LoadingBusyProps = {
  busyMessage: string;
};

function LoadingBusy({ busyMessage }: LoadingBusyProps) {
  console.log("busyMessage", busyMessage);
  return (
    <div className={`busy-overlay ${!busyMessage && "hidden"}`}>
      <span className="spinner" />
      <span className="small">{busyMessage}</span>
    </div>
  );
}

export default LoadingBusy;
