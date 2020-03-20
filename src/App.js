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
        data,
        sortedBy: 1
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

  numericColumn = (name, propKey) => ({
    name,
    formatter: row => new Intl.NumberFormat().format(row[propKey]),
    alignRight: true,
    comparator: (a, b) => b[propKey] - a[propKey],
    sortDescending: true
  });

  columns = [
    {
      name: 'Country',
      formatter: row => row.countryName,
      alignRight: false,
      comparator: (a, b) => a.countryName.localeCompare(b.countryName),
      sortDescending: false
    },
    this.numericColumn('New', 'newCases'),
    this.numericColumn('Deaths', 'deaths')
  ]

  columnClassName = column => column.alignRight ? 'text-right' : 'text-left';

  renderContent() {
    if (this.state) {
      const byCountryCode = this.byCountryCode(this.state.data.filter(record =>
        record.date >= this.state.dateRange.startDate && record.date <= this.state.dateRange.endDate));

      return (
        <div>
          <div className="row justify-content-between">
            <div className="col-auto">{this.state.dateRange.startDate.toLocaleDateString()} &ndash; {this.state.dateRange.endDate.toLocaleDateString()}</div>
            <div className="col-auto">
              <button className="btn btn-primary py-0" onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}>
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
              <tr>{this.columns.map((column, index) =>
                <th className={this.columnClassName(column)} key={index}>{
                  index === this.state.sortedBy ?
                    <button className="btn btn-link m-0 p-0 text-nowrap">
                      <b>{column.name}</b> <i className={'fas ' + (column.sortDescending ? 'fa-sort-down' : 'fa-sort-up')}></i>
                    </button> :
                    <button
                      className="btn btn-link m-0 p-0"
                      onClick={event => this.setState({ sortedBy: index })}>
                      {column.name}
                    </button>
                }</th>
              )}</tr>
            </thead>
            <tbody>
              {Object.entries(byCountryCode)
                .sort(([key1, value1], [key2, value2]) => this.columns[this.state.sortedBy].comparator(value1, value2))
                .map(([key, value]) => (
                  <tr key={key}>
                    {this.columns.map((column, index) => (
                      <td className={this.columnClassName(column)} key={index}>{column.formatter(value)}</td>
                    ))}
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
        <footer className="page-footer">
          Site by <a href="https://blog.rmlowe.com/">Robert Lowe</a>;
          data from <a href="https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide">ECDC</a>
        </footer>
      </div >
    );
  }
}

export default App;
