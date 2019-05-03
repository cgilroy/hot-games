import React, { Component } from 'react';
import '../css/App.css';
import '../css/mobile.css';
import { APISchedFetch } from './APISchedFetch.js';

export class App extends Component {
  render() {
    return (
      <div className="App">
        <APISchedFetch />
      </div>
    );
  }
}

export default App;
