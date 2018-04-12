import React, { Component } from 'react';
import logo from '../../logo.svg';
import Login from '../Login/Login';
import SuccessMessage from '../SuccessMessage/SuccessMessage';
import './App.css';

class App extends Component {
  state = {
    complete: false,
    firstName: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (document.cookie.includes('JWT')) {
      this.setState({ complete: true });
    }
    document.cookie = `firstName=${this.state.firstName}`
  }

  handleInput = (e) => {
    this.setState({ firstName: e.currentTarget.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 data-test-id="h1" className="App-title">Welcome to React</h1>
          <nav data-test-id="navbar" className='navbar' role="navigation">
            <ul>
              <li data-test-id="navbar-li" className="nav-li"><a href="#">Home</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="#">About</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="#">Skills</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="#">Works</a></li>
            </ul>
          </nav>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {this.state.complete ? (<SuccessMessage />) : (<Login submit={this.handleSubmit} input={this.handleInput} />)}
      </div>
    );
  }
}

export default App;
