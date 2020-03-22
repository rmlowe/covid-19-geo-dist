import React from 'react';
import axios from 'axios';
import parse from 'csv-parse';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area } from 'recharts';

import DatePicker from './DatePicker';
import Total from './Total';
import CountrySummary from './CountrySummary';

const minDate = data => new Date(Math.min(...data.map(record => record.date)));

const maxDate = data => new Date(Math.max(...data.map(record => record.date)));

const reducer = (acc, cur) => ({
  date: acc.date,
  dateString: acc.dateString,
  dateNumber: acc.dateNumber,
  countryName: acc.countryName,
  newCases: acc.newCases + cur.newCases,
  deaths: acc.deaths + cur.deaths
});

const reduceByKey = (arr, key, reducer) => arr.reduce((acc, cur) => {
  const prevValue = acc[cur[key]];
  acc[cur[key]] = prevValue ? reducer(prevValue, cur) : cur;
  return acc;
}, {});

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
      this.setState({
        dateRange: {
          startDate: minDate(data),
          endDate: maxDate(data)
        },
        data
      });
    });
  }

  renderContent() {
    if (this.state) {
      const filtered = this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate && record.date <= this.state.dateRange.endDate);
      const totals = filtered.reduce(reducer);

      const byDate = Object.values(reduceByKey(filtered, 'date', reducer));
      byDate.sort((a, b) => a.dateNumber - b.dateNumber);

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
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={byDate} margin={{ top: 20 }}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="dateString" hide={true} />
              {/* <XAxis dataKey="dateNumber" type="number" scale="time" domain={['auto', 'auto']} tickFormatter={tick => new Date(tick).toLocaleDateString()} /> */}
              <YAxis />
              <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Area name="New confirmed cases" type="monotone" dataKey="newCases" stroke="#8884d8" fillOpacity={1} fill="url(#colorUv)" />
              <Area name="Deaths" type="monotone" dataKey="deaths" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
          </ResponsiveContainer>
          <CountrySummary byCountryCode={reduceByKey(filtered, 'countryCode', reducer)} />
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
