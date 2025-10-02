import { useState, type ChangeEvent, type FC } from "react";

type PageWrapperProps = {
  title?: string;
  children: React.ReactNode;
  onDelete?: () => void;
  onEditTitle?: (title: string) => void;
};
const PageWrapper: FC<PageWrapperProps> = ({
  title,
  onEditTitle,
  children,
  onDelete,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editVal, setEditVal] = useState(title);

  const handleEditVal = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEditVal(val);
  };

  const onConfirmEdit = () => {
    if (!editVal) return;
    onEditTitle?.(editVal);
    setIsEdit(false);
  };

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 min-h-screen sm:max-w-[calc(100%-320px)] md:max-w-[calc(100%-320px)]">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{title ?? "Data Visualizer"}</h1>
          {isEdit && (
            <div>
              <input
                className="border!"
                type="text"
                value={editVal}
                onChange={handleEditVal}
              />
              <button disabled={!editVal} onClick={onConfirmEdit}>
                Confirm
              </button>
            </div>
          )}
        </div>
        {onEditTitle && (
          <button className="mr-4" onClick={() => setIsEdit(true)}>
            Edit
          </button>
        )}
        {onDelete && <button onClick={onDelete}>Delete</button>}
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
