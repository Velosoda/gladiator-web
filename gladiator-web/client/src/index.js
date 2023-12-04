import  App  from 'App';
import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />);
