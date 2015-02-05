class SomeService {
  // @ngInject
  constructor( $http ) {
    this.$http = $http;
  }

  /**
   *
   * @returns {*}
   */
    getData() {
    return this.$http.get('https://json-monster.herokuapp.com/data/14/test/posts');
  }

  getPromise() {
    return new Promise(( resolve, reject ) => {
      resolve('no');
    })
  }
}

export {SomeService}
