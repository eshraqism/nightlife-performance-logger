
import React from 'react';
import { Loader2 } from 'lucide-react';
import Container from '../layout/Container';

const EventDetailLoading = () => {
  return (
    <Container>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </Container>
  );
};

export default EventDetailLoading;
