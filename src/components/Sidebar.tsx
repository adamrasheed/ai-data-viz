import type { FC } from "react";
import type { Dataset } from "./types";

type SidebarProps = {
  onAddItem: (title: string) => void;
  onSelectItem: (id: string) => void;
  items: Pick<Dataset, "id" | "label">[];
};
const Sidebar: FC<SidebarProps> = ({ onAddItem, onSelectItem, items }) => {
  return (
    <aside className="p-4 bg-gray-50 w-xs">
      <h4 className="font-bold">Datasets</h4>
      <ul>
        {items.map((item) => (
          <li className="block" key={item.id}>
            <button
              className="block w-full rounded-none! bg-none!"
              onClick={() => onSelectItem(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onAddItem} className="mt-8 w-full">
        Add Item +
      </button>
    </aside>
  );
};

export default Sidebar;
