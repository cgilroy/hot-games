import React, { Component } from 'react';
import './App.css';
import { APISchedFetch } from './APISchedFetch.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronUp, faChevronDown);
export class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={'/resources/hockey-night-live-logo.jpg'}/>
        </header>
        <APISchedFetch />
      </div>
    );
  }
}

export default App;
