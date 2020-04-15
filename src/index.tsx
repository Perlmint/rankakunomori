import React from 'react';
import ReactDOM from 'react-dom';
import Fossil from './fossil';
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

ReactDOM.render(<Fossil />, document.getElementById('app'));