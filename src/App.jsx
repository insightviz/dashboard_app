import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./Pages/Home/Home'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const StopSearch = lazy(() => import('./Pages/StopSearch/StopSearch'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={
            <Suspense fallback={<>Loading...</>}>
              <Home />
            </Suspense>} />
          <Route path="/stopsearch" element={
            <Suspense fallback={<>Loading...</>}>
              <StopSearch />
            </Suspense>} />
          <Route path="/contact" element={
            <Suspense fallback={<>Loading...</>}>
              <Contact />
            </Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
  }