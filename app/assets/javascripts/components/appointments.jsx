import React from 'react';
import AppointmentForm from './appointment_form';
import { AppointmentsList } from './appointments_list';
import update from 'immutability-helper';
import formErrors from './formErrors';

class Appointments extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        appointments: this.props.appointments,
        title: '',
        appt_time: '',
        formErrors: {}
      }
    }
  
    handleUserInput (obj) {
      this.setState(obj);
    }
  
    handleFormSubmit () {
      const appointment = {title: this.state.title, appt_time: this.state.appt_time};
      $.post('/appointments',
              {appointment: appointment})
            .done((data) => {
              this.addNewAppointment(data);
            })
            .fail((response) => {
                console.log(response)
                this.setState({formErrors: response.responseJSON})
            });
    }
  
    addNewAppointment (appointment) {
      const appointments = React.addons.update(this.state.appointments, { $push: [appointment]});
      this.setState({
        appointments: appointments.sort(function(a,b){
          return new Date(a.appt_time) - new Date(b.appt_time);
        })
      });
    }
  
    render () {
      return (
        <div>
            <formErrors formErrors = {this.state.formErrors} />
          <AppointmentForm input_title={this.state.title}
            input_appt_time={this.state.appt_time}
            onUserInput={(obj) => this.handleUserInput(obj)}
            onFormSubmit={() => this.handleFormSubmit()} />

          <AppointmentsList appointments={this.state.appointments} />
        </div>
      )
    }
  }