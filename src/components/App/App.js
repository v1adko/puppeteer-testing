import React, { Component } from 'react';
import Login from '../Login/Login';
import SuccessMessage from '../SuccessMessage/SuccessMessage';
import './App.css';

class App extends Component {
  state = {
    complete: false,
    firstName: '',
    starWars: {}
  };

  async componentDidMount() {
    const data = await fetch('https://swapi.co/api/people/1/').then(res => res.json());
    this.setState({ starWars: data });
  }

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
          <h3 data-test-id="h1" className="App-title">Welcome to <span>E2E</span> Testing with <a href="https://github.com/facebook/jest">Jest</a> and <a href="https://github.com/GoogleChrome/puppeteer">Puppeteer</a></h3>
          <nav data-test-id="navbar" className='navbar'>
            <ul>
              <li data-test-id="navbar-li" className="nav-li"><a href="/home">Home</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="https://twitter.com/v1adko_">About</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="https://github.com/v1adko">Skills</a></li>
              <li data-test-id="navbar-li" className="nav-li"><a href="https://broken.link">Works</a></li>
            </ul>
          </nav>
        </header>
        <h3 data-test-id="starWars">{this.state.starWars.url ? 'Got StarWars Data' : 'The Dark Side is Winning'}</h3>
        {this.state.complete ? (<SuccessMessage />) : (<Login submit={this.handleSubmit} input={this.handleInput} />)}
      </div>
    );
  }
}

export default App;
