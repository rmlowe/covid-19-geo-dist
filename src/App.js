import React from 'react';
import { withRouter } from "react-router";
import axios from 'axios';
import parse from 'csv-parse';

import DateAndStylePicker from './DateAndStylePicker';
import Total from './Total';
import Chart from './Chart';
import CountrySummary from './CountrySummary';
import { casesReducer, reduceByKey, nextDate } from './util';

const dateRange = data => {
  const dates = data.map(record => record.date);
  return { startDate: new Date(Math.min(...dates)), endDate: new Date(Math.max(...dates)) }
};

const smoothed = data => {
  const result = {};

  for (const record of data) {
    let date = record.date;

    for (let i = 0; i < 7; i++) {
      const key = date.toLocaleDateString() + '-' + record.countryCode;
      const value = result[key] || {
        date,
        dateString: date.toLocaleDateString(),
        countryName: record.countryName,
        countryCode: record.countryCode,
        newCases: 0,
        deaths: 0,
        population: record.population
      };
      result[key] = {
        date: value.date,
        dateString: value.dateString,
        countryName: value.countryName,
        countryCode: value.countryCode,
        newCases: value.newCases + record.newCases / 7,
        deaths: value.deaths + record.deaths / 7,
        population: value.population
      }
      date = nextDate(date);
    }
  }

  return Object.values(result);
};

class App extends React.Component {
  async componentDidMount() {
    const response = await axios.get('https://data.foreignvir.us/');
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
        selectedCountries,
        smoothed: smoothed(data)
      });
    });
  }

  render() {
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
      const smoothedParam = new URLSearchParams(this.props.location.search).get('smoothed');
      const smoothed = smoothedParam !== null && smoothedParam.toUpperCase() === 'TRUE';
      const chartData = smoothed ?
        this.state.smoothed.filter(record => this.state.selectedCountries[record.countryCode]) :
        filteredByDateAndCountry;

      return (
        <>
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
          <Chart
            data={chartData}
            dateRange={this.state.dateRange}
            denominator={denom}
          />
          <div className="row py-1">
            <div className="col">
              <div className="form-check text-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="smoothed"
                  checked={smoothed}
                  onChange={e => { this.props.history.push(`/?smoothed=${!smoothed}`) }}
                />
                <label className="form-check-label" htmlFor="smoothed">
                  Show 7-day average
                </label>
              </div>
            </div>
          </div>
          <CountrySummary
            byCountryCode={Object.entries(byCountryCode)}
            onChange={selectedCountries => this.setState({ selectedCountries })}
            selectedCountries={this.state.selectedCountries}
            perMillion={this.state.perMillion}
          />
        </>
      );
    } else {
      return <p>Loading data ...</p>;
    }
  }
}

export default withRouter(App);
