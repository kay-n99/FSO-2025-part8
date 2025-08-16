import { useState } from "react";
import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../App";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  const { data: allBooksData, loading: allLoading  } = useQuery(ALL_BOOKS, {
    variables: { genre: null},
    fetchPolicy: 'cache-and-network',
  })

  const { data: filteredBookData, loading: filteredLoading, refetch } = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre},
    fetchPolicy: "cache-and-network",
  });

  if(allLoading || filteredLoading)return <div>loading...</div>

  const allBooks = allBooksData?.allBooks || [];
  const books = filteredBookData?.allBooks || [];

  const genres = [...new Set(allBooks.flatMap((b) => b.genres))];

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    refetch({ genre });
  };

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
            onClick={() => handleGenreClick(g)}
            style={{ marginRight: "0.5rem" }}
          >
            {g}
          </button>
        ))}
        <button onClick={() => handleGenreClick(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
