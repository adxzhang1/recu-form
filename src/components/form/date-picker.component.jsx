import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';


// DatePicker
const DatePicker = ({ label, value, onChange, required, error }) => {
  const [selectedDate, setSelectedDate] = React.useState(value);

  // Handle change in date
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onChange(date);
  };

  // Render
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        margin="normal"
        label={label}
        format="MM/dd/yyyy"
        value={selectedDate}
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
        required={required}
        error={error}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePicker;