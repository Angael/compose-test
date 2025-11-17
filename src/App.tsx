import { useQuery } from "@tanstack/react-query";

const apiUrl = import.meta.env.VITE_API_URL;

function App() {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch(`${apiUrl}/records`).then((res) => res.json())
  });

  const append = async () => {
    await fetch(`${apiUrl}/records`, {
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
