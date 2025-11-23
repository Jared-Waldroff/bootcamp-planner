import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GeneratorPage } from './pages/GeneratorPage';
import { HistoryPage } from './pages/HistoryPage';

import { ExercisesPage } from './pages/ExercisesPage';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<GeneratorPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/exercises" element={<ExercisesPage />} />
            </Routes>
        </Layout>
    );
}

export default App;
