import { createBrowserRouter } from 'react-router-dom';
import JourneyOptionFlowDetails from '../pages/admin/JourneyOptionFlowDetails';

const router = createBrowserRouter([
  // ... outras rotas ...
  {
    path: '/admin/journey-option-flows/:id',
    element: <JourneyOptionFlowDetails />
  }
]);

export default router; 