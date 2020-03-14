import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

class App extends React.Component {
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
      this.setState({
        datePickerVisible: false,
        dateRange: {
          startDate: new Date(Math.min(...data.map(record => record.date))),
          endDate: new Date(Math.max(...data.map(record => record.date)))
        },
        data
      });
    });
  }

  byCountry(data) {
    return data.reduce((acc, cur) => {
      const value = acc[cur.country] || { newCases: 0, deaths: 0 };
      acc[cur.country] = { newCases: value.newCases + cur.newCases, deaths: value.deaths + cur.deaths };
      return acc;
    }, {});
  }

  renderContent() {
    if (this.state) {
      const byCountry = this.byCountry(this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate && record.date <= this.state.dateRange.endDate));

      return (
        <div>
          <div className="row justify-content-between">
            <div className="col-auto">{this.state.dateRange.startDate.toLocaleDateString()} &ndash; {this.state.dateRange.endDate.toLocaleDateString()}</div>
            <div className="col-auto">
              <a href="#" onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}>
                {this.state.datePickerVisible ? 'Hide date picker' : 'Show date picker'}
              </a>
            </div>
          </div>
          {this.state.datePickerVisible && <DateRange
            onChange={item => this.setState({ dateRange: item.range1 })}
            ranges={[this.state.dateRange]}
          />}
          <table className="table">
            <thead>
              <tr>
                <th>Country</th>
                <th>New cases</th>
                <th>Deaths</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(byCountry)
                .filter(([key, value]) => value.newCases !== 0 || value.deaths !== 0)
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value.newCases}</td>
                    <td>{value.deaths}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <p>Loading data ...</p>;
    }
  }

  render() {
    return (
      <div className="App container">
        <h1>COVID-19 by country</h1>
        {this.renderContent()}
      </div>
    );
  }
}

export default App;
