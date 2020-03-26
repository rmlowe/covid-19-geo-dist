import React from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

class DatePicker extends React.Component {
  state = { datePickerVisible: false };

  datesAreDefault = () => this.props.dateRange.startDate.getTime() === this.props.minDate.getTime() &&
    this.props.dateRange.endDate.getTime() === this.props.maxDate.getTime();

  resetDates = event => this.props.onChange({ startDate: this.props.minDate, endDate: this.props.maxDate });

  render() {
    return <div>
      <div className="row justify-content-between">
        <div className="col-auto my-1">
          <strong>
            {this.props.dateRange.startDate.toLocaleDateString()} &ndash; {this.props.dateRange.endDate.toLocaleDateString()}
          </strong>
          {
            !this.datesAreDefault() && <span> <i class="fas fa-times-circle" onClick={this.resetDates} /></span>
          }
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary py-0 px-2"
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
    </div >;
  }
}

export default DatePicker;