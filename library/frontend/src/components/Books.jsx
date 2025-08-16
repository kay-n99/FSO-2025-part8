import { useState } from "react";
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../App";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { loading, data } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre},
  })

  if(loading)return <div>loading...</div>
  const books = data.allBooks
  const genres = [...new Set(books.flatMap((b) => b.genres))]

  return (
    <div>
      <h2>books</h2>

      {selectedGenre && (
        <p>
          in genre <strong>{selectedGenre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : "Unknown Author"}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "1rem" }}>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            style={{ marginRight: "0.5rem" }}
          >
            {g}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
