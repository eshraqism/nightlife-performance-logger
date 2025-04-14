
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../layout/Container';

const EventNotFound = () => {
  return (
    <Container>
      <div className="py-10">
        <div className="glass-card rounded-xl p-12 text-center">
          <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The event you're looking for doesn't exist or has been deleted.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default EventNotFound;
