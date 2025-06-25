import React from 'react';
import MovieJourney from './MovieJourney';

const MovieJourneyWrapper: React.FC = () => {
  return (
    <MovieJourney 
      selectedSentiment={null as any} 
      onBack={() => {}} 
      onRestart={() => {}} 
    />
  );
};

export default MovieJourneyWrapper; 