import { useState, useEffect } from "react";

const Authors = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const authors = props.authors;

  useEffect(() => {
    if(authors.length > 0 && name === "") {
      setName(authors[0].name);
    }
  }, [authors, name]);


  const submit = async (event) => {
    event.preventDefault();

    console.log("update author...");

    props.editAuthors({ variables: { name, born } });

    setBorn("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <table>
          <tr>
            <td>name</td>
            <td>
              <select value={name} onChange={({ target }) => setName(target.value)}>
                {authors.map((a) => {
                  return (
                    <>
                      <option value={a.name} key={a.name}>
                        {a.name}
                      </option>
                    </>
                  );
                })}
              </select>
            </td>
          </tr>
          <tr>
            <td>born</td>
            <td>
              <input
                value={born}
                onChange={({ target }) => setBorn(parseInt(target.value))}
              />
            </td>
          </tr>
        </table>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
