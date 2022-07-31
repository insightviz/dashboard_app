import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout/Layout';
import { lazy, Suspense, useContext } from 'react';
import { ThemeContext } from './AppTheme';
import { GeistProvider, CssBaseline } from '@geist-ui/core'


const Home = lazy(() => import('./Pages/Home/Home'));
const Contact = lazy(() => import('./Pages/Contact/Contact'));
const StopSearch = lazy(() => import('./Pages/StopSearch/StopSearch'));

export default function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <GeistProvider themeType={theme}>
      <CssBaseline />
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
    </GeistProvider>
  );
  }