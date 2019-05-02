import React, { Component } from 'react';

class Greeting extends Component {
  renderGreeting = () => {
    let greeting = '';
    const now = new Date();
    const hour = now.getHours();
    if (hour < 6) {
      greeting = '凌晨好！';
    } else if (hour < 9) {
      greeting = '早上好！';
    } else if (hour < 12) {
      greeting = '上午好！';
    } else if (hour < 14) {
      greeting = '中午好！';
    } else if (hour < 17) {
      greeting = '下午好！';
    } else if (hour < 19) {
      greeting = '傍晚好！';
    } else if (hour < 22) {
      greeting = '晚上好！';
    } else {
      greeting = '夜里好！';
    }
    return greeting;
  };

  render() {
    const { currentUser } = this.props;

    const { name } = currentUser;

    return (
      <span>
        {' '}
        {this.renderGreeting()} {name} ，祝你开心每一天！
      </span>
    );
  }
}

export default Greeting;
