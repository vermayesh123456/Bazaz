import React, { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [userInfo, setUserInfo] = useState({
    full_name: '',
    dob: '',
    email: '',
    roll_number: ''
  });
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    let parsedInput;
    try {
      parsedInput = JSON.parse(input);
    } catch (err) {
      console.warn("Invalid JSON input, using default value");
      parsedInput = { data: ["A", "1", "B", "2"] };
    }

    try {
      const payload = {
        ...parsedInput,
        ...userInfo
      };
      const res = await fetch('https://backend-ia65dryqq-yash-verma.vercel.app/bfhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("API error:", err);
      setError('API error occurred');
    }
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    let filteredResponse = {};
    if (selectedOptions.includes('Alphabets')) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      filteredResponse.highest_lowercase_alphabet = response.highest_lowercase_alphabet;
    }

    return (
      <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
    );
  };

  return (
    <div className="App">
      <h1>Bajaj Finserv Health Challenge</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInfo.full_name}
          onChange={(e) => setUserInfo({...userInfo, full_name: e.target.value})}
          placeholder="Full Name"
          required
        />
        <input
          type="text"
          value={userInfo.dob}
          onChange={(e) => setUserInfo({...userInfo, dob: e.target.value})}
          placeholder="Date of Birth (DDMMYYYY)"
          required
        />
        <input
          type="email"
          value={userInfo.email}
          onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
          placeholder="Email"
          required
        />
        <input
          type="text"
          value={userInfo.roll_number}
          onChange={(e) => setUserInfo({...userInfo, roll_number: e.target.value})}
          placeholder="Roll Number"
          required
        />
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Enter JSON here (e.g., {"data": ["A","1","B","2"]})'
          required
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p className="error">{error}</p>}
      {response && (
        <div>
          <h2>Response:</h2>
          <select
            multiple
            value={selectedOptions}
            onChange={(e) => setSelectedOptions(Array.from(e.target.selectedOptions, option => option.value))}
          >
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          {renderFilteredResponse()}
        </div>
      )}
    </div>
  );
}

export default App;