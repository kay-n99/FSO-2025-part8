import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../App'

const Recommended = (props) => {
    const { loading: meLoading, data: meData } = useQuery(ME)
    const { loading: booksLoading, data: booksData } = useQuery(ALL_BOOKS)

    if(meLoading || booksLoading){
        return <div>loading...</div>
    }

    const favoriteGenre = meData.me.favoriteGenre
    const books = booksData.allBooks.filter(b => b.genres.includes(favoriteGenre))
    
    return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favoriteGenre}</b></p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author ? b.author.name : 'Unknown'}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended