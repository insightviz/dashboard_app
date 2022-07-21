import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import Home from './Pages/Home/Home';
import Contact from './Pages/Contact/Contact';
import StopSearch from './Pages/StopSearch/StopSearch';

export default function App({mode, onChange}) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout mode={mode} onChange={onChange}/>}>
            <Route index element={<Home />} />
            <Route path="/stopsearch" element={<StopSearch />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }