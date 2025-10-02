import type { FC } from "react";

type ModalProps = {
  title?: string;
  message?: string;
  open?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const Modal: FC<ModalProps> = ({
  open,
  title = "Modal",
  message,
  onCancel,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="flex flex-col p-4 absolute h-70 w-80 bg-gray-100 rounded z-20 top-1/2 left-1/2 -translate-y-1/12 -translate-x-1/2">
      <header className="flex justify-between">
        <p className="font-bold">{title}</p>
        <button onClick={onCancel}>X</button>
      </header>
      <div className="flex-1">{message}</div>
      <footer className="flex justify-end gap-2">
        {onCancel && <button onClick={onCancel}>Cancel</button>}
        {onConfirm && (
          <button onClick={onConfirm} className="bg-green-300!">
            Confirm
          </button>
        )}
      </footer>
    </div>
  );
};

export default Modal;
