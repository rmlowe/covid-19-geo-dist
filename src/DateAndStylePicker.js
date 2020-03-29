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

class DateAndStylePicker extends React.Component {
  state = { datePickerVisible: false };

  render() {
    return <div className="row">
      <div className="col-xl">
        <div className="row justify-content-between">
          <div className="col-auto font-weight-bold">
            {this.props.dateRange.startDate.toLocaleDateString()} &ndash; {this.props.dateRange.endDate.toLocaleDateString()}
          </div>
          <div className="col-auto">
            <button
              className={'btn btn-outline-secondary py-0 px-2' + (this.state.datePickerVisible ? ' active' : '')}
              onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}
            >
              <i className="fas fa-calendar mr-1" /> Date picker
          </button>
          </div>
        </div>
        {
          this.state.datePickerVisible && <div className="row justify-content-center"><div className="col-auto"><DateRange
            onChange={item => this.props.onChange({ dateRange: item.range1 })}
            ranges={[this.props.dateRange]}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
          /></div></div>
        }
      </div>
      <div className="col-xl">
        <div className="btn-group btn-block" role="group">
          {
            [
              { key: 'day', label: '1 day', startDate: this.props.maxDate },
              { key: 'week', label: '1 week', startDate: addDays(this.props.maxDate, -6) },
              { key: 'month', label: '1 month', startDate: addMonths(addDays(this.props.maxDate, 1), -1) },
              { key: 'all', label: 'All time', startDate: this.props.minDate }
            ].map(namedRange => {
              const active =
                this.props.dateRange.startDate.getTime() === namedRange.startDate.getTime()
                && this.props.dateRange.endDate.getTime() === this.props.maxDate.getTime();
              return (
                <button
                  key={namedRange.key}
                  type="button"
                  className={'btn btn-outline-secondary py-0' + (active ? ' active' : '')}
                  onClick={event => this.props.onChange({
                    dateRange: { startDate: namedRange.startDate, endDate: this.props.maxDate }
                  })}
                >
                  {namedRange.label}
                </button>
              );
            })
          }
        </div>
      </div>
      <div className="col-xl">
        <div className="btn-group btn-block" role="group">
          {
            [
              { key: 'absolute', label: 'Absolute counts', value: false },
              { key: 'perMillion', label: 'Counts per million people', value: true }
            ].map(countStyle =>
              <button
                className={'btn btn-outline-secondary py-0' + (this.props.perMillion === countStyle.value ? ' active' : '')}
                key={countStyle.key}
                onClick={event => this.props.onChange({ perMillion: countStyle.value })}
              >
                {countStyle.label}
              </button>
            )
          }
        </div>
      </div>
    </div >;
  }
}

export default DateAndStylePicker;