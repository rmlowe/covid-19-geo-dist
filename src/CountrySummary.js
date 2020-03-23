import React from 'react';

import { countryCodeToFlag } from './util';

const numericColumn = (name, propKey) => ({
  name: () => name,
  formatter: (key, value) => new Intl.NumberFormat().format(value[propKey]),
  alignRight: true,
  comparator: (a, b) => b[propKey] - a[propKey],
  sortDescending: true
});

const columnClassName = column => column.alignRight ? 'text-right' : 'text-left';

class CountrySummary extends React.Component {
  doToggle = key => {
    const newSelectedCountries = { ...this.props.selectedCountries };
    newSelectedCountries[key] = !newSelectedCountries[key];
    this.props.onChange(newSelectedCountries);
  };

  setAll = value => event => {
    const newSelectedCountries = { ...this.props.selectedCountries };

    for (const key of Object.keys(this.props.byCountryCode)) {
      newSelectedCountries[key] = value;
    }

    this.props.onChange(newSelectedCountries);
  };

  headerCheckBox = () => {
    console.log('In headerCheckBox()');
    let hasChecked = false;
    let hasUnchecked = false;

    for (const key of Object.keys(this.props.byCountryCode)) {
      if (this.props.selectedCountries[key]) {
        hasChecked = true;
      } else {
        hasUnchecked = true;
      }
    }

    if (hasChecked) {
      if (hasUnchecked) {
        return <i className="fas fa-minus-square" onClick={this.setAll(true)} />;
      } else {
        return <i className="fas fa-check-square" onClick={this.setAll(false)} />
      }
    } else {
      return <i className="far fa-square" onClick={this.setAll(true)} />;
    }
  };

  columns = [
    {
      name: this.headerCheckBox,
      formatter: (key, value) => (
        <i
          className={this.props.selectedCountries[key] ? 'fas fa-check-square' : 'far fa-square'}
          onClick={event => this.doToggle(key)}
        />
      ),
      alignRight: true
    },
    {
      name: () => 'Country',
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
  ];

  state = { sortedBy: 2 };

  render() {
    return <table className="table table-hover">
      <thead>
        <tr>{this.columns.map((column, index) =>
          <th className={columnClassName(column)} key={index}>{
            column.comparator ?
              index === this.state.sortedBy ?
                <button className="btn btn-link m-0 p-0 text-nowrap">
                  <b>{column.name()}</b> <i className={'fas ' + (column.sortDescending ? 'fa-sort-down' : 'fa-sort-up')}></i>
                </button> :
                <button
                  className="btn btn-link m-0 p-0"
                  onClick={event => this.setState({ sortedBy: index })}>
                  {column.name()}
                </button> :
              column.name()
          }</th>
        )}</tr>
      </thead>
      <tbody>
        {Object.entries(this.props.byCountryCode)
          .sort(([key1, value1], [key2, value2]) => this.columns[this.state.sortedBy].comparator(value1, value2))
          .map(([key, value]) => (
            <tr key={key}>
              {this.columns.map((column, index) => (
                <td className={columnClassName(column)} key={index}>{column.formatter(key, value)}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>;
  }
}

export default CountrySummary;