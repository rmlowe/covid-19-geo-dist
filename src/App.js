import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

class App extends React.Component {
  minDate = data => new Date(Math.min(...data.map(record => record.date)));

  maxDate = data => new Date(Math.max(...data.map(record => record.date)));

  async componentDidMount() {
    const response = await axios.get('/geodist.csv');
    parse(response.data, (err, output) => {
      const data = output.slice(1).map(record => {
        return {
          date: new Date(record[3], record[2] - 1, record[1]),
          countryName: record[6].replace(/_/g, ' '),
          countryCode: record[7],
          newCases: +record[4],
          deaths: +record[5]
        };
      });
      this.setState({
        datePickerVisible: false,
        dateRange: {
          startDate: this.minDate(data),
          endDate: this.maxDate(data)
        },
        data
      });
    });
  }

  byCountry(data) {
    return data.reduce((acc, cur) => {
      const oldValue = acc[cur.countryCode];
      acc[cur.countryCode] = oldValue ? {
        date: oldValue.date,
        countryName: oldValue.countryName,
        countryCode: oldValue.countryCode,
        newCases: oldValue.newCases + cur.newCases,
        deaths: oldValue.deaths + cur.deaths
      } : cur;
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
              <button type="button" className="btn btn-primary" onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}>
                {this.state.datePickerVisible ? 'Hide date picker' : 'Show date picker'}
              </button>
            </div>
          </div>
          {this.state.datePickerVisible && <DateRange
            onChange={item => this.setState({ dateRange: item.range1 })}
            ranges={[this.state.dateRange]}
            minDate={this.minDate(this.state.data)}
            maxDate={this.maxDate(this.state.data)}
          />}
          <table className="table">
            <thead>
              <tr>
                <th>Country</th>
                <th>New</th>
                <th>Deaths</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(byCountry)
                .filter(value => value.newCases !== 0 || value.deaths !== 0)
                .map(value => (
                  <tr key={value.countryCode}>
                    <td>{value.countryName}</td>
                    <td>{new Intl.NumberFormat().format(value.newCases)}</td>
                    <td>{new Intl.NumberFormat().format(value.deaths)}</td>
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
        <footer class="page-footer">
          Site by <a href="https://blog.rmlowe.com/">Robert Lowe</a>;
          data from <a href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide">ECDC</a>
        </footer>
      </div >
    );
  }
}

export default App;
