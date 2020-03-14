import React from 'react';
import axios from 'axios';
import parse from 'csv-parse'

class App extends React.Component {
  state = { data: null };

  async componentDidMount() {
    const response = await axios.get('/geodist.csv');
    parse(response.data, (err, output) => {
      const data = output.slice(1).map(record => {
        const dateParts = record[0].split('/');
        return {
          date: new Date(dateParts[2], dateParts[1] - 1, dateParts[0]),
          country: record[1],
          newCases: +record[2],
          deaths: +record[3]
        };
      });
      console.log(data);
      this.setState({ data });
    });
  }

  byCountry(data) {
    return data.reduce((acc, cur) => {
      (acc[cur.country] = acc[cur.country] || []).push(cur);
      return acc;
    }, {});
  }

  renderData() {
    if (this.state.data) {
      return (
        <ul>
          {Object.keys(this.byCountry(this.state.data)).map(country => <li>{country}</li>)}
        </ul>
      );
    } else {
      return <p>Loading data ...</p>;
    }
  }

  render() {
    return (
      <div className="App">
        <h1>COVID-19 by country</h1>
        {this.state.data === null ? 'Loading data ...' : this.renderData()}
      </div>
    );
  }
}

export default App;
