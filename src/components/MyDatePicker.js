import React from 'react'
import DatePicker from "react-datepicker";
import moment from 'moment'

import "react-datepicker/dist/react-datepicker.css";

export class MyDatePicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            startDate: moment(this.props.date).toDate()
        }
        this.handleDateChange = this.handleDateChange.bind(this)
    }
    handleDateChange = date => {
        this.setState({
          startDate: date
        });
        this.props.updateDate(date)
      };    
    render() {
        return <DatePicker selected={this.state.startDate} onChange={date => this.handleDateChange(moment(date).format('YYYY-MM-DD'))} />
    }
}