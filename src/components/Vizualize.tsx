import type { FC } from "react";
import Table from "./Table";
import { type Item } from "./types";
import Chart from "./Chart";
type VizualizeProps = {
  data: Item[];
};

const Vizualize: FC<VizualizeProps> = ({ data }) => {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      <div className="flex-1">
        <Chart items={data} />
      </div>
      <div className="flex-1 overflow-auto">
        <Table items={data} />
      </div>
    </div>
  );
};

export default Vizualize;
