import React from 'react';

import countryCodeToFlag from './countryCodeToFlag';

const numericColumn = (name, propKey) => ({
  name,
  formatter: (key, value) => new Intl.NumberFormat().format(value[propKey]),
  alignRight: true,
  comparator: (a, b) => b[propKey] - a[propKey],
  sortDescending: true
});

const columns = [
  {
    name: 'Country',
    formatter: (key, value) => {
      const flag = countryCodeToFlag(key);
      return flag ? flag + ' ' + value.countryName : (key + ' ' + value.countryName)
    },
    alignRight: false,
    comparator: (a, b) => a.countryName.localeCompare(b.countryName),
    sortDescending: false
  },
  numericColumn('Cases', 'newCases'),
  numericColumn('Deaths', 'deaths')
]

const columnClassName = column => column.alignRight ? 'text-right' : 'text-left';

class CountrySummary extends React.Component {
  state = { sortedBy: 1 };

  render() {
    return <table className="table">
      <thead>
        <tr>{columns.map((column, index) =>
          <th className={columnClassName(column)} key={index}>{
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
        {Object.entries(this.props.byCountryCode)
          .sort(([key1, value1], [key2, value2]) => columns[this.state.sortedBy].comparator(value1, value2))
          .map(([key, value]) => (
            <tr key={key}>
              {columns.map((column, index) => (
                <td className={columnClassName(column)} key={index}>{column.formatter(key, value)}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>;
  }
}

export default CountrySummary;