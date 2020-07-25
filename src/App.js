import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';

import DateAndStylePicker from './DateAndStylePicker';
import Total from './Total';
import Chart from './Chart';
import CountrySummary from './CountrySummary';
import { casesReducer, reduceByKey } from './util';

const dateRange = data => {
  const dates = data.map(record => record.date);
  return { startDate: new Date(Math.min(...dates)), endDate: new Date(Math.max(...dates)) }
};

class App extends React.Component {
  async componentDidMount() {
    const url = '/geodist.csv';
    // const url = 'https://opendata.ecdc.europa.eu/covid19/casedistribution/csv';
    const response = await axios.get(url);
    parse(response.data, (err, output) => {
      const data = output.slice(1).map(record => {
        const date = new Date(record[3], record[2] - 1, record[1]);
        return {
          date,
          dateString: date.toLocaleDateString(),
          countryName: record[6].replace(/_/g, ' ').replace(/CuraÃ§ao/g, 'Curaçao'),
          countryCode: record[7],
          newCases: +record[4],
          deaths: +record[5],
          population: +record[9]
        };
      });
      const selectedCountries = {};
      data.forEach(record => selectedCountries[record.countryCode] = true);
      this.setState({
        dateRange: dateRange(data),
        perMillion: false,
        data,
        selectedCountries
      });
    });
  }

  renderContent() {
    if (this.state) {
      const filteredByDate = this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate
        && record.date <= this.state.dateRange.endDate
        && (record.population > 0 || !this.state.perMillion));
      const filteredByDateAndCountry = filteredByDate.filter(record => this.state.selectedCountries[record.countryCode]);
      const totals = filteredByDateAndCountry.reduce(casesReducer, { newCases: 0, deaths: 0 });
      const theDateRange = dateRange(this.state.data);
      const byCountryCode = reduceByKey(filteredByDate, 'countryCode', casesReducer);
      const denom = this.state.perMillion
        ? (Object.entries(byCountryCode).filter(([key, value]) => this.state.selectedCountries[key]).map(([key, value]) => value.population).reduce((a, b) => a + b) / 1000000)
        : 1;

      return (
        <div>
          <DateAndStylePicker
            dateRange={this.state.dateRange}
            onChange={state => this.setState(state)}
            minDate={theDateRange.startDate}
            maxDate={theDateRange.endDate}
            perMillion={this.state.perMillion}
          />
          <div className="row justify-content-around py-1">
            <div className="col-auto">
              <Total label="Total cases" value={totals.newCases / denom} />
            </div>
            <div className="col-auto">
              <Total label="Total deaths" value={totals.deaths / denom} />
            </div>
          </div>
          <Chart data={filteredByDateAndCountry} dateRange={this.state.dateRange} denominator={denom} />
          <CountrySummary
            byCountryCode={Object.entries(byCountryCode)}
            onChange={selectedCountries => this.setState({ selectedCountries })}
            selectedCountries={this.state.selectedCountries}
            perMillion={this.state.perMillion}
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
