import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);
  let today = new Date();
  let year = today.getFullYear();
  let day = String(today.getDate()).padStart(2, '0');
  let month = String(today.getMonth() + 1).padStart(2, '0');
  console.log(day, month)

  useEffect(() => {

    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/filemap.xml')
      .then((response) => response.text())
      .then(async (response) => {
        const parser = new DOMParser()
        const xml = parser.parseFromString(response, 'text/xml')
        const results = [].slice.call(xml.getElementsByTagName('Key')).filter((key) => key.textContent.includes('.json'))
        let files = results.map(file => file.textContent.split('/')[1])
        files = await files.filter(item => {
          console.log('month', item.slice(23, 25), 'day', item.slice(26, 28))
          return item.slice(26, 28) === day && item.slice(23, 25) === month && item.includes(year.toString());
        })
        return files;
      })
      .then(files => {
        console.log(data);
        setData(files)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {

  }, [data])

  return (
    <div className="App">
      <h1>STONX</h1>
      {data.map((item, index) => {
        <p key={index}>{`${item}`}</p>
      })}
    </div>
  );
}

export default App;
