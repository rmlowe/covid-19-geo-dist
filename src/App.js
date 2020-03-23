import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';

import DatePicker from './DatePicker';
import Total from './Total';
import Chart from './Chart';
import CountrySummary from './CountrySummary';
import { casesReducer, reduceByKey } from './util';

const minDate = data => new Date(Math.min(...data.map(record => record.date)));

const maxDate = data => new Date(Math.max(...data.map(record => record.date)));

class App extends React.Component {
  async componentDidMount() {
    const response = await axios.get('/geodist.csv');
    parse(response.data, (err, output) => {
      const data = output.slice(1).map(record => {
        const date = new Date(record[3], record[2] - 1, record[1]);
        return {
          date,
          dateString: date.toLocaleDateString(),
          dateNumber: date.getTime(),
          countryName: record[6].replace(/_/g, ' '),
          countryCode: record[7],
          newCases: +record[4],
          deaths: +record[5]
        };
      });
      const selectedCountries = {};
      data.forEach(record => selectedCountries[record.countryCode] = true);
      this.setState({
        dateRange: {
          startDate: minDate(data),
          endDate: maxDate(data)
        },
        data,
        selectedCountries
      });
    });
  }

  renderContent() {
    if (this.state) {
      const filteredByDate = this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate && record.date <= this.state.dateRange.endDate);
      const filteredByDateAndCountry = filteredByDate.filter(record => this.state.selectedCountries[record.countryCode]);
      const totals = filteredByDateAndCountry.reduce(casesReducer, { newCases: 0, deaths: 0 });

      return (
        <div>
          <DatePicker
            dateRange={this.state.dateRange}
            onChange={dateRange => this.setState({ dateRange })}
            minDate={minDate(this.state.data)}
            maxDate={maxDate(this.state.data)}
          />
          <div className="row justify-content-around py-1 border-top">
            <div className="col-auto">
              <Total label="Total cases" value={totals.newCases} />
            </div>
            <div className="col-auto">
              <Total label="Total deaths" value={totals.deaths} />
            </div>
          </div>
          <Chart data={filteredByDateAndCountry} />
          <CountrySummary
            byCountryCode={reduceByKey(filteredByDate, 'countryCode', casesReducer)}
            onChange={selectedCountries => this.setState({ selectedCountries })}
            selectedCountries={this.state.selectedCountries}
          />
        </div >
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
