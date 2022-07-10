import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Shared/Layout';
import Home from './Home/Home';
import Contact from './Contact/Contact';
import StopSearch from './StopSearch/StopSearch';

export default function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/stopsearch" element={<StopSearch />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }