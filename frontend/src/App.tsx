import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PageList from './components/pageList';
import { AuthContext } from './AuthContext';

function App () {
  const [token, setToken] = useState<string | null>(null);

  return (
    <>
      <AuthContext.Provider value={{ token, setToken }}>
        <Router>
          <PageList />
        </Router>
      </AuthContext.Provider>
    </>
  );
}

export default App;
