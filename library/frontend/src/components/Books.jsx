import { useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const books = props.books;

  const genres = [...new Set(books.flatMap((b) => b.genres))];

  const filteredBooks =
    selectedGenre === null
      ? books
      : books.filter((b) => b.genres.includes(selectedGenre));

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
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author ? a.author.name : "Unknown Author"}</td>
              <td>{a.published}</td>
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
