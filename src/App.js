import React from 'react';
import {inject, observer} from'mobx-react';

import './App.css';
import Header from './components/Header';
import MainContent from './components/MainContent';

const App = inject("store")(
  observer(({store}) => {
    const { showHeader } = store;
    return (
      <div className="App">
        {showHeader && <Header />}
        <main className="main-content">
          <MainContent />
        </main>
      </div>
    );
  })
);

export default App;
