import React from 'react';

const Home: React.FC = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Bug-Sleuth</h1>
    <p className="text-lg text-gray-600 mb-8">AI-Powered Duplicate Bug Finder</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
      <div className="card text-center">
        <h3 className="text-lg font-semibold mb-2">Submit Bugs</h3>
        <p className="text-gray-600">Submit new bug reports and find similar existing bugs</p>
      </div>
      <div className="card text-center">
        <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
        <p className="text-gray-600">Uses TF-IDF and cosine similarity to find duplicate bugs</p>
      </div>
      <div className="card text-center">
        <h3 className="text-lg font-semibold mb-2">Admin Tools</h3>
        <p className="text-gray-600">Upload datasets and retrain ML models</p>
      </div>
    </div>
  </div>
);

export default Home;
