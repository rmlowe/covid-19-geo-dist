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

const countryParams = selectedCountries => {
  const nCountries = Object.keys(selectedCountries).length;
  const includedCountries = Object.entries(selectedCountries).flatMap(([key, value]) => value ? [key] : []);
  if (includedCountries.length === nCountries) {
    return [];
  } else if (includedCountries.length <= nCountries / 2) {
    return [['includedCountries', includedCountries.join(' ')]];
  } else {
    return [['excludedCountries', Object.entries(selectedCountries).flatMap(([key, value]) => value ? [] : [key]).join(' ')]];
  }
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
    const response = await axios.get('/data.csv');
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
      this.setState({
        dateRange: dateRange(data),
        perMillion: false,
        data,
        smoothed: smoothed(data)
      });
    });
  }

  push = ({ selectedCountries, smoothed }) => {
    const init = [];

    init.push(...countryParams(selectedCountries));

    if (!smoothed) {
      init.push(['smoothed', 'false']);
    }

    this.props.history.push(init.length ? ('/?' + new URLSearchParams(init)) : '/');
  };

  urlState = () => {
    const params = new URLSearchParams(this.props.location.search);
    const smoothedParam = params.get('smoothed');
    const smoothed = smoothedParam === null || smoothedParam.toUpperCase() === 'TRUE';
    const includedCountries = params.get('includedCountries');
    const excludedCountries = params.get('excludedCountries');
    const selectedCountries = {};

    for (const record of this.state.data) {
      selectedCountries[record.countryCode] = includedCountries === null;
    }

    const setSelections = (countries, value) => {
      if (countries !== null) {
        for (const country of countries.split(' ')) {
          if (selectedCountries[country] !== undefined) {
            selectedCountries[country] = value;
          }
        }
      }
    };
    setSelections(includedCountries, true);
    setSelections(excludedCountries, false);
    return { selectedCountries, smoothed };
  };

  title = selectedCountries => {
    const codes = Object.entries(selectedCountries).flatMap(([countryCode, selected]) => selected ? [countryCode] : []);
    if (codes.length === Object.keys(selectedCountries).length) {
      return 'COVID-19 worldwide';
    } else if (codes.length === 1) {
      return `COVID-19 in ${this.state.data.find(record => record.countryCode === codes[0]).countryName}`;
    } else {
      return `COVID-19 in ${codes.length} countries`;
    }
  };

  render() {
    if (this.state) {
      const { selectedCountries, smoothed } = this.urlState();
      const filteredByDate = this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate
        && record.date <= this.state.dateRange.endDate
        && (record.population > 0 || !this.state.perMillion));
      const filteredByDateAndCountry = filteredByDate.filter(record => selectedCountries[record.countryCode]);
      const totals = filteredByDateAndCountry.reduce(casesReducer, { newCases: 0, deaths: 0 });
      const theDateRange = dateRange(this.state.data);
      const byCountryCode = reduceByKey(filteredByDate, 'countryCode', casesReducer);
      const denom = this.state.perMillion
        ? (Object.entries(byCountryCode).filter(([key, value]) => selectedCountries[key]).map(([key, value]) => value.population).reduce((a, b) => a + b) / 1000000)
        : 1;
      const chartData = smoothed ?
        this.state.smoothed.filter(record => selectedCountries[record.countryCode]) :
        filteredByDateAndCountry;
      const title = this.title(selectedCountries);
      document.title = title;

      return (
        <>
          <h1 className="h5 my-2 border-bottom">{title}</h1>
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
                  onChange={() => this.push({ smoothed: !smoothed, selectedCountries })}
                />
                <label className="form-check-label" htmlFor="smoothed">
                  Show 7-day average
                </label>
              </div>
            </div>
          </div>
          <CountrySummary
            byCountryCode={Object.entries(byCountryCode)}
            onChange={selectedCountries => this.push({ smoothed, selectedCountries })}
            selectedCountries={selectedCountries}
            perMillion={this.state.perMillion}
          />
        </>
      );
    } else {
      return <><h1 className="h5 my-2 border-bottom">COVID-19 by country</h1><p>Loading data ...</p></>;
    }
  }
}

export default withRouter(App);
