import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { gql, useQuery, useMutation } from '@apollo/client'

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
  }
}
`

const ALL_BOOKS = gql`
query {
  allBooks {
    title
    author{
      name
    }
    published
  }
}
`

const ADD_BOOKS = gql`
  mutation addBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!){
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ){
      title
      author
      published
      genres  
    }
  }
`

const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $born: Int!){
    editAuthor(
      name: $name,
      born: $born
    ){
      name
      born  
    }
  }
`

const App = () => {
  const [page, setPage] = useState("authors");

  const [ addBooks ] = useMutation(ADD_BOOKS, {
    refetchQueries: [ {query: ALL_BOOKS} ]
  })

  const [ editAuthors ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ {query: ALL_AUTHORS} ]
  })

  const resultAuthors = useQuery(ALL_AUTHORS)
  const resultBooks = useQuery(ALL_BOOKS)

  if(resultAuthors.loading || resultBooks.loading){
    return <div>Loading...</div>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors show={page === "authors"} authors={resultAuthors.data.allAuthors} editAuthors={editAuthors}/>

      <Books show={page === "books"} books={resultBooks.data?.allBooks || []}/>

      <NewBook show={page === "add"} addBooks={addBooks} />
    </div>
  );
};

export default App;
