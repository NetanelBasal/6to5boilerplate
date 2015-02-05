import {SomeService} from './someService.js';

var services = angular.module('services', [])
  .service('SomeService', SomeService);

export {services};


