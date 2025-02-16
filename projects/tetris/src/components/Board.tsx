import { BoardPixel } from "../constants";

interface BoardProps {
  data: BoardPixel[][]
};

export function Board({ data }: BoardProps) {
  return <div>
    <h2>Board Data</h2>
    <pre>{JSON.stringify(data, undefined, 4)}</pre>
  </div>;
}
