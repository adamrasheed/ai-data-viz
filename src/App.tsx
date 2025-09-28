import { useState } from "react";
import PageWrapper from "./components/PageWrapper";
import Upload from "./components/Upload";
import Vizualize from "./components/Vizualize";
import { responseSchema, type Item } from "./components/types";

function App() {
  const [data, setData] = useState<Item[] | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      setData(parsed.data.responses);
    };
    reader.readAsText(file);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <PageWrapper showResetButton onReset={() => setData(null)}>
      {data ? <Vizualize data={data} /> : <Upload onUpload={handleUpload} />}
    </PageWrapper>
  );
}

export default App;
