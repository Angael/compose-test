import { useQuery } from "@tanstack/react-query";

function App() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch("http://localhost:5000/records").then((res) => res.json())
  });

  const append = async () => {
    await fetch("http://localhost:5000/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: "New Record" })
    });
    refetch();
  };

  return (
    <div>
      <button onClick={append}>Append</button>
      <pre>{JSON.stringify({ isPending, error, data }, null, 2)}</pre>
    </div>
  );
}

export default App;
