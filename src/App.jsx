import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityList from './components/Cities';
import WeatherDetails from './components/WeatherDetails';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<CityList />} />
                <Route path="/city/:name" element={<WeatherDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
