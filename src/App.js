import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);

  useEffect(() => {
    
    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/filemap.xml')
    .then((response) => response.text())
    .then((response) => {
      const parser = new DOMParser()
      const xml = parser.parseFromString(response, 'text/xml')
      const results = [].slice.call( xml.getElementsByTagName('Key') ).filter((key) => key.textContent.includes('.json'))
      const files = results.map(file => file.textContent.split('/')[1])

      setData(files);

      console.log(data);
    })
    .catch((err) => {
      console.log(err)
    })
  }, [])

  return (
    <div className="App">
        <h1>STONX</h1>
    </div>
  );
}

export default App;
