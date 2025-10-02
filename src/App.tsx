import { useMemo, useState } from "react";
import PageWrapper from "./components/PageWrapper";
import Upload from "./components/Upload";
import Vizualize from "./components/Vizualize";
import { type Dataset, responseSchema } from "./components/types";
import Sidebar from "./components/Sidebar";
import Modal from "./components/Modal";

function App() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentDatasetId, setCurrentDatasetId] = useState<string | null>("");
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== "string") {
        return;
      }
      const raw = JSON.parse(text);
      const parsed = responseSchema.safeParse(raw);

      if (!parsed.success) {
        console.log(parsed.error.message);
        setError(parsed.error.message);
        return;
      }

      const id = crypto.randomUUID();
      setDatasets((c) => {
        const newDatasets = c.slice();

        const newDataset: Dataset = {
          id,
          label: file.name,
          data: parsed.data.responses,
        };

        newDatasets.push(newDataset);

        return newDatasets;
      });

      setCurrentDatasetId(id);
    };
    reader.readAsText(file);
  };

  const currentDataset = useMemo(() => {
    return datasets.find((d) => d.id === currentDatasetId);
  }, [datasets, currentDatasetId]);

  const onSelectItem = (id: string) => {
    setCurrentDatasetId(id);
  };

  const handleEditTitle = (label: string) => {
    if (!currentDatasetId) return;

    setDatasets((c) => {
      const newDs = c.slice();
      return newDs.map((d) => {
        if (d.id === currentDatasetId) {
          return {
            ...d,
            label,
          };
        }
        return d;
      });
    });
  };

  const handleTriggerDelete = () => setIsDeleteModalOpen(true);

  const handleAddItem = () => {
    setCurrentDatasetId(null);
  };

  const handleRemoveDataset = () => {
    if (!currentDataset) return;

    setDatasets((c) => {
      const newDs = c.slice();
      return newDs.filter((d) => d.id !== currentDatasetId);
    });
    setIsDeleteModalOpen(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  const dataTitles = datasets?.map((d) => ({ id: d.id, label: d.label }));

  return (
    <>
      <div className="flex min-h-screen">
        <Sidebar
          items={dataTitles}
          onAddItem={handleAddItem}
          onSelectItem={onSelectItem}
        />
        <PageWrapper
          key={currentDataset?.id}
          title={currentDataset?.label}
          onEditTitle={currentDataset && handleEditTitle}
          onDelete={currentDataset && handleTriggerDelete}
        >
          {currentDataset ? (
            <Vizualize data={currentDataset.data} />
          ) : (
            <Upload onUpload={handleUpload} />
          )}
        </PageWrapper>
      </div>
      <Modal
        title={
          currentDataset &&
          `Are you sure you want to delete ${currentDataset.label}?`
        }
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleRemoveDataset()}
      />
    </>
  );
}

export default App;
