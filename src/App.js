import { useState, useEffect } from 'react';

function App() {

  const [data, setData] = useState([]);
  const [trades, setTrades] = useState([]);
  let today = new Date();
  let year = '2023'//today.getFullYear();
  let day = '10'//String(today.getDate()).padStart(2, '0');
  let month = '03'//String(today.getMonth() + 1).padStart(2, '0');

  useEffect(() => {

    fetch('https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/filemap.xml')
      .then((response) => response.text())
      .then(async (response) => {
        const parser = new DOMParser()
        const xml = parser.parseFromString(response, 'text/xml')
        const results = [].slice.call(xml.getElementsByTagName('Key')).filter((key) => key.textContent.includes('.json'))
        let files = results.map(file => file.textContent.split('/')[1])
        files = await files.slice(0, 50).filter(item => {
          // console.log(item.slice(23, 25), month, item.slice(26, 28), day, item.slice(29, 33), year.toString())
          return item.slice(26, 28) === day && item.slice(23, 25) === month && item.slice(29, 33) === year.toString();
        })
        setData(files);
        console.log(data);
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    const newTrades = [];
    const promises = [];
    data.forEach(path => {
      promises.push(
        fetch(`https://house-stock-watcher-data.s3-us-west-2.amazonaws.com/data/${path}`)
          .then(res => res.json())
          .then(trade => {
            console.log(trade);
            newTrades.push(trade);
          })
          .catch(err => {
            console.log(`Error getting trade at ${path}: ${err}`)
          })
      )
    })

    Promise.all(promises)
      .then(() => {
        const transactions = [];
        newTrades.forEach(trade => {
          //console.log(trade);
          trade.forEach(innerTrade => {
            innerTrade.transactions.forEach(transaction => {
              transactions.push(transaction);
              console.log('transactions', transactions);
            })
          })
        })
        console.log('trades', trades[0].transactions[0].amount);
      })

  }, [])


  return (
    <div className="App">
      <h1>STONX</h1>
      {trades.map((item, index) => {
        <p key={index}>{`${item}`}</p>
      })}
    </div>
  );
}

export default App;
