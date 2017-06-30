import React, { Component } from 'react';

class Redirect extends Component {
  componentDidMount() {
    this.handleRedirect();
    // console.log('called');
  }

  handleRedirect() {
    if (!this.props.redirectTo) return;
    // console.log('going');
    if (this.props.params.location.pathname !== this.props.redirectTo){
      this.props.params.history.push(this.props.redirectTo);
    }
  }

  render() {
    // console.log(this.props.history.push('/list'));
    return false;
  }
}

export default Redirect;