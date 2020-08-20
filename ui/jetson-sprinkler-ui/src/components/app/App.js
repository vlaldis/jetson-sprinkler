import React, {Component } from 'react';
import { Button } from 'react-bootstrap';
//import {Get } from '../backend/Backend';

import logo from '../../images/logo.svg';
import './App.css';

import axios from 'axios';

const instance = axios.create({baseURL: "http://192.168.1.102:6001", responseType: "json"});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {message: "nic"};
  }

  handleClick = () => {
    try {
      instance
      .get('/api/startTest')
      .then(res => res.data)
      .then(json => this.setState({message: json.message}))
      .catch(err => alert(err));
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
      this.setState({message: e});
    }
  }

  handleStop = () => {
    try {
      instance
      .get('/api/stopTest')
      .then(res => res.data)
      .then(json => this.setState({message: json.message}))
      .catch(err => alert(err));
    } catch (e) {
      console.log(`Axios request failed: ${e}`);
      this.setState({message: e});
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Jetson sprinkler</h2>
        </div>
        <Button variant="primary" size="sm" onClick={this.handleClick} active>
          Start test
        </Button>
        <Button variant="primary" size="sm" onClick={this.handleStop} active>
          Stop test
        </Button>
        <p>
          {this.state.message}
        </p>
      </div>
    );
 }
}

export default App;
