import type { FC } from "react";
import { type Item } from "./types";
import {
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table";

type TableProps = {
  items: Item[];
};

const columnHelper = createColumnHelper<Item>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("timestamp", {
    header: "Timestamp",
  }),
  columnHelper.accessor("model", {
    header: "Model",
  }),
  columnHelper.accessor("prompt_tokens", {
    header: "Prompt Tokens",
  }),
  columnHelper.accessor("completion_tokens", {
    header: "Completion Tokens",
  }),
  columnHelper.accessor("total_tokens", {
    header: "Total Tokens",
  }),
  columnHelper.accessor("response_time_ms", {
    header: "Response Time (ms)",
  }),
  columnHelper.accessor("status", {
    header: "Status",
  }),
  columnHelper.accessor("cost_usd", {
    header: "Cost (USD)",
  }),
  columnHelper.accessor("temperature", {
    header: "Temperature",
  }),
  columnHelper.accessor("max_tokens", {
    header: "Max Tokens",
  }),
];

const Table: FC<TableProps> = ({ items }) => {
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { getHeaderGroups, getRowModel } = table;

  return (
    <div className="h-full flex flex-col">
      <h4 className="text-lg font-semibold mb-4">Data Table</h4>
      <div className="flex-1 overflow-auto border border-gray-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-gray-50 z-10">
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-b border-gray-300 px-3 py-2 text-left font-medium text-gray-700 whitespace-nowrap min-w-[120px]"
                  >
                    {typeof header.column.columnDef.header === "string"
                      ? header.column.columnDef.header
                      : header.column.id}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="border-r border-gray-200 px-3 py-2 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]"
                    title={String(cell.getValue())}
                  >
                    {cell.getValue() === null ? (
                      <span className="text-gray-400">-</span>
                    ) : (
                      String(cell.getValue())
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
