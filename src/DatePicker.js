import React from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

class DatePicker extends React.Component {
  state = { datePickerVisible: false };

  render() {
    return <div>
      <div className="row justify-content-between">
        <div className="col-auto">
          {this.props.dateRange.startDate.toLocaleDateString()} &ndash; {this.props.dateRange.endDate.toLocaleDateString()}
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary py-0"
            onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}
          >
            {this.state.datePickerVisible ? 'Hide date picker' : 'Show date picker'}
          </button>
        </div>
      </div>
      {this.state.datePickerVisible && <DateRange
        onChange={item => this.props.onChange(item.range1)}
        ranges={[this.props.dateRange]}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
      />}
    </div>;
  }
}

export default DatePicker;