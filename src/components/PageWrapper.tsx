import type { FC } from "react";

type PageWrapperProps = {
  children: React.ReactNode;
  showResetButton?: boolean;
  onReset?: () => void;
};
const PageWrapper: FC<PageWrapperProps> = ({
  children,
  showResetButton,
  onReset,
}) => {
  return (
    <div className="p-4 flex flex-col gap-4 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Data Visualizer</h1>
        {showResetButton && <button onClick={onReset}>Reset</button>}
      </div>
      {children}
    </div>
  );
};

export default PageWrapper;
