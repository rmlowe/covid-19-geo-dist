import React from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

const addDays = (date, n) => {
  const result = new Date(date);
  result.setDate(date.getDate() + n);
  return result;
}

const addMonths = (date, n) => {
  const result = new Date(date);
  result.setMonth(date.getMonth() + n);
  return result;
}

class DatePicker extends React.Component {
  state = { datePickerVisible: false };

  render() {
    return <div>
      <div className="row justify-content-between">
        <div className="col-auto my-1">
          <strong>
            {this.props.dateRange.startDate.toLocaleDateString()} &ndash; {this.props.dateRange.endDate.toLocaleDateString()}
          </strong>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-outline-secondary py-0 px-2"
            onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}
          >
            {this.state.datePickerVisible ? 'Hide date picker' : 'Show date picker'}
          </button>
        </div>
      </div>
      {
        this.state.datePickerVisible && <div className="row justify-content-center"><div className="col-auto"><DateRange
          onChange={item => this.props.onChange(item.range1)}
          ranges={[this.props.dateRange]}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
        /></div></div>
      }
      <div className="btn-group btn-block" role="group">
        {
          [
            { key: 'day', label: '1 day', startDate: this.props.maxDate },
            { key: 'week', label: '1 week', startDate: addDays(this.props.maxDate, -6) },
            { key: 'month', label: '1 month', startDate: addMonths(addDays(this.props.maxDate, 1), -1) },
            { key: 'all', label: 'All time', startDate: this.props.minDate }
          ].map(dateRange => {
            const active =
              this.props.dateRange.startDate.getTime() === dateRange.startDate.getTime()
              && this.props.dateRange.endDate.getTime() === this.props.maxDate.getTime();
            return (
              <button
                key={dateRange.key}
                type="button"
                className={'btn btn-outline-secondary py-0' + (active ? ' active' : '')}
                onClick={event => this.props.onChange({ startDate: dateRange.startDate, endDate: this.props.maxDate })}
              >
                {dateRange.label}
              </button>
            );
          })
        }
      </div>
    </div >;
  }
}

export default DatePicker;