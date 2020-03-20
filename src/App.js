import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';

import DatePicker from './DatePicker';
import CountrySummary from './CountrySummary';

const minDate = data => new Date(Math.min(...data.map(record => record.date)));

const maxDate = data => new Date(Math.max(...data.map(record => record.date)));

class App extends React.Component {
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
        dateRange: {
          startDate: minDate(data),
          endDate: maxDate(data)
        },
        data
      });
    });
  }

  byCountryCode(data) {
    return data.reduce((acc, cur) => {
      const prevValue = acc[cur.countryCode];
      acc[cur.countryCode] = prevValue ? {
        countryName: prevValue.countryName,
        newCases: prevValue.newCases + cur.newCases,
        deaths: prevValue.deaths + cur.deaths
      } : cur;
      return acc;
    }, {});
  }

  renderContent() {
    if (this.state) {
      const byCountryCode = this.byCountryCode(this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate && record.date <= this.state.dateRange.endDate));

      return (
        <div>
          <DatePicker
            dateRange={this.state.dateRange}
            onChange={dateRange => this.setState({ dateRange })}
            minDate={minDate(this.state.data)}
            maxDate={maxDate(this.state.data)}
          />
          <CountrySummary byCountryCode={byCountryCode} />
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
        <footer className="page-footer">
          Site by <a href="https://blog.rmlowe.com/">Robert Lowe</a>;
          data from <a href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide">ECDC</a>
        </footer>
      </div >
    );
  }
}

export default App;
