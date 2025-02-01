"use client";

import { useEffect, useState } from "react";

const page = () => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState<{ title: string | null; code: string | null }>({
    title: null,
    code: null
  });
  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await fetch("/api/getSnippets");
        const data = await res.json();
        setSnippets(data);
      } catch (error) {
        console.log("Error fetching the Snippets")
      }
    }
    fetchSnippets();
  }, [])

  const getSnippetById = async (id: string) => {
    try {
      console.log("request going")
      const res = await fetch(`/api/getSnippetById/${id}`)
      console.log("request coming")
      const data = await res.json();
      setSelectedSnippet(data)
    } catch {
      console.log("error in retriveing snippet ")
    }
  }
    
  return (
    <div>
        <div>
      <h1>Snippets Page</h1>

      {/* List all snippets with a button to fetch by ID */}
      <ul>
        {snippets.map((snippet: { id: string; title: string }) => (
          <li key={snippet.id}>
            {snippet.title}{" "}
            <button onClick={() => getSnippetById(snippet.id)}>View</button>
          </li>
        ))}
      </ul>

      {/* Display selected snippet details */}
      {selectedSnippet && (
        <div>
          <h2>{selectedSnippet.title}</h2>
          <p>{selectedSnippet.code}</p>
        </div>
      )}
    </div>
    </div>
  )
}

export default page