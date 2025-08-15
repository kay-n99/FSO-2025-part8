import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { gql, useQuery, useMutation } from "@apollo/client";
import LoginForm from "./components/Login";

const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
    }
  }
`;

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

const ADD_BOOKS = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author { name }
      published
      genres
    }
  }
`;

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

const ME = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );

  const logout = () => {
    setToken(null);
    localStorage.clear();
    setPage("authors");
  };

  const [addBooks] = useMutation(ADD_BOOKS, {
    refetchQueries: [{ query: ALL_BOOKS }],
  });

  const [editAuthors] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);

  if (resultAuthors.loading || resultBooks.loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token ? (
          <button onClick={() => setPage("login")}>login</button>
        ) : (
          <button onClick={logout}>logout</button>
        )}
      </div>

      {page === "authors" && (
        <Authors
          authors={resultAuthors.data.allAuthors}
          editAuthors={editAuthors}
        />
      )}

      {page === "books" && <Books books={resultBooks.data?.allBooks || []} />}

      {page === "add" && token && <NewBook addBooks={addBooks} />}

      {page === "login" && <LoginForm setToken={setToken} setPage={setPage} />}
    </div>
  );
};

export default App;
