require('angular');
require('angular-ui-router');

import {modules} from './modules.js';

angular.module('test', modules);

import {services} from './services/services.index.js';

import {home} from './home/home.index.js';


