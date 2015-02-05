/**
 * HomeController
 */
class HomeController {

  /**
   *
   * @param $scope
   * @param SomeService
   */
    // @ngInject
    constructor( SomeService ) {
    this.name = 'moshe';
    this.SomeService = SomeService;

  }

  /**
   * get data
   */
    get() {
    this.SomeService.getData().then(res => this.data = res.data);
  }

}

export {HomeController};
