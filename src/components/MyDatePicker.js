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
    increaseDate = () => {
        let newDate = moment(this.state.startDate).add(1, "days")
        this.handleDateChange(newDate.format('YYYY-MM-DD'))
    }
    decreaseDate = () => {
        let newDate = moment(this.state.startDate).subtract(1, "days")
        this.handleDateChange(newDate.format('YYYY-MM-DD'))
    }
    handleDateChange = date => {
        this.setState({
          startDate: date
        });
        this.props.updateDate(date)
      };    
    render() {
        return (
            // <DatePicker selected={this.state.startDate} onChange={date => this.handleDateChange(moment(date).format('YYYY-MM-DD'))} />
            <div className="datePicker">
                <div className="datePicker__button" onClick={() => this.decreaseDate()}>&#9664;</div>
                <p style={{width:'100%'}}>{moment(this.state.startDate).format('LL')}</p>
                <div className="datePicker__button" onClick={() => this.increaseDate()}>&#9654;</div>
            </div>
        )
    }
}