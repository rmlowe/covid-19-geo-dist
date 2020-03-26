import React from 'react';

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';

class DatePicker extends React.Component {
  state = { datePickerVisible: false };

  render() {
    return <div>
      <div className="row justify-content-between">
        <div className="col-auto my-1"><strong>
          {this.props.dateRange.startDate.toLocaleDateString()} &ndash; {this.props.dateRange.endDate.toLocaleDateString()}
        </strong></div>
        <div className="col-auto">
          <button
            className="btn btn-primary p-0"
            onClick={() => this.setState({ datePickerVisible: !this.state.datePickerVisible })}
          >
            {this.state.datePickerVisible ? 'Hide calendar' : 'Show calendar'}
          </button>
          <button className="btn btn-primary p-0">Reset</button>
        </div>
      </div>
      {this.state.datePickerVisible && <div className="row justify-content-center"><div className="col-auto"><DateRange
        onChange={item => this.props.onChange(item.range1)}
        ranges={[this.props.dateRange]}
        minDate={this.props.minDate}
        maxDate={this.props.maxDate}
      /></div></div>}
    </div>;
  }
}

export default DatePicker;