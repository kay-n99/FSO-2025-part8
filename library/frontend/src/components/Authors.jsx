import { useState } from "react";

const Authors = (props) => {
  const [name, setName] = useState("Robert Martin");
  const [born, setBorn] = useState();

  if (!props.show) {
    return null;
  }
  const authors = props.authors;

  const submit = async (event) => {
    event.preventDefault();

    console.log("update author...");

    props.editAuthors({ variables: { name, born } });
    setName("");
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
              <select value={name} onChange={(e) => setName(e.target.value)}>
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
