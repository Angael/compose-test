import { useQuery } from "@tanstack/react-query";
import { HelloPath } from "server";

function App() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("http://localhost:5000/").then((res) => res.json() as HelloPath)
  });

  return (
    <div>
      data:
      <pre>{JSON.stringify({ isPending, error, data }, null, 2)}</pre>
    </div>
  );
}

export default App;
