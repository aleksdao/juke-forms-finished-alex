'use strict';

var juke = angular.module('juke', ['ui.router', 'ngMessages', 'ui.bootstrap', 'ui.bootstrap.typeahead', 'ui.sortable'])
  .run(['uiSortableConfig', function(uiSortableConfig){
    uiSortableConfig.jQueryPath = 'https://code.jquery.com/jquery-1.11.3.min.js';
    uiSortableConfig.jQueryUiPath = 'https://code.jquery.com/ui/1.11.4/jquery-ui.js';
}]);

juke.run(function ($rootScope) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    console.error('Error transitioning from "' + fromState.name + '" to "' + toState.name + '":', error);
  });
});
