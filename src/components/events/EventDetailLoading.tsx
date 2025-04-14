
import React from 'react';
import { Loader2 } from 'lucide-react';
import Container from '../layout/Container';

const EventDetailLoading = () => {
  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    </Container>
  );
};

export default EventDetailLoading;
