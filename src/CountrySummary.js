import React from 'react';

// import { countryCodeToFlag } from './util';

const numericColumn = (name, value) => ({
  name: () => name,
  formatter: (key, row) => new Intl.NumberFormat().format(value(row)),
  alignRight: true,
  comparator: (a, b) => value(b) - value(a),
  sortDescending: true
});

const columnClassName = column => column.alignRight ? 'text-right' : 'text-left';

class CountrySummary extends React.Component {
  handler = callback => event => {
    event.stopPropagation();
    const newSelectedCountries = { ...this.props.selectedCountries };

    for (const entry of this.props.byCountryCode) {
      const countryCode = entry[0];
      newSelectedCountries[countryCode] = callback(countryCode, this.props.selectedCountries[countryCode]);
    }

    this.props.onChange(newSelectedCountries);
  }

  setAll = value => this.handler((countryCode, oldVlue) => value);

  headerCheckBox = () => {
    let hasChecked = false;
    let hasUnchecked = false;

    for (const entry of this.props.byCountryCode) {
      if (this.props.selectedCountries[entry[0]]) {
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

  columns = () => {
    const result = [
      {
        name: this.headerCheckBox,
        formatter: (key, value) => (
          <i
            className={this.props.selectedCountries[key] ? 'fas fa-check-square' : 'far fa-square'}
            onClick={this.handler((countryCode, oldValue) => countryCode === key ? !oldValue : oldValue)}
          />
        ),
        alignRight: true
      },
      {
        name: () => 'Country',
        formatter: (key, value) => {
          // const flag = countryCodeToFlag(key);
          // return flag ? flag + ' ' + value.countryName : (key + ' ' + value.countryName);
          return value.countryName;
        },
        alignRight: false,
        comparator: (a, b) => a.countryName.localeCompare(b.countryName),
        sortDescending: false
      }
    ];

    return result.concat(this.props.perMillion ?
      [
        numericColumn('Cases', row => 1000000 * row.newCases / row.population),
        numericColumn('Deaths', row => 1000000 * row.deaths / row.population)
      ] :
      [
        numericColumn('Cases', row => row.newCases),
        numericColumn('Deaths', row => row.deaths),
      ]);
  };

  state = { sortedBy: 2 };

  render() {
    const cols = this.columns();

    return <table className="table table-hover">
      <thead>
        <tr>{cols.map((column, index) =>
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
        {this.props.byCountryCode
          .sort(([key1, value1], [key2, value2]) => cols[this.state.sortedBy].comparator(value1, value2))
          .map(([key, value]) => (
            <tr key={key} onClick={this.handler((countryCode, oldValue) => countryCode === key)}>
              {cols.map((column, index) => (
                <td className={columnClassName(column)} key={index}>{column.formatter(key, value)}</td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>;
  }
}

export default CountrySummary;