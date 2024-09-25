import './App.css';
import UserDetails from './components/UserDetails';
import GeminiResponse from './components/GeminiResponse';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<UserDetails />} />
          <Route path="/gemini-response" element={<GeminiResponse />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
