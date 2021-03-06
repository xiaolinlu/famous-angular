/**
 * @ngdoc directive
 * @name faTouchend
 * @module famous.angular
 * @restrict A
 * @param {expression} faTouchend Expression to evaluate upon touchend. (Event object is available as `$event`)
 * @description
 * This directive allows you to specify custom behavior after an element that {@link https://developer.mozilla.org/en-US/docs/Web/Reference/Events/touchend has been touched}.
 *
 * @usage
 * ```html
 * <ANY fa-touchend="expression">
 *
 * </ANY>
 * ```
 * 
 * Note:  For testing purposes during development, enable mobile emulation: https://developer.chrome.com/devtools/docs/mobile-emulation
 * 
 * @example
 * Upon a touchend event firing, fa-touchend will evaluate the expression bound to it.
 * 
 * Touchstart fires once upon first touch; touchend fires as the touch point is moved along a touch surface; touchend fires upon release of the touch point.
 * 
 * ### Fa-touchend on an fa-surface
 * `Fa-touchend` can be used on an `fa-surface`.  Internally, a Famous Surface has a `.on()` method that binds a callback function to an event type handled by that Surface.
 * The function expression bound to `fa-touchend` is bound to that `fa-surface`'s touchend eventHandler, and when touchend fires, the function expression will be called. 
 * 
 * ```html
 * <fa-modifier fa-size="[100, 100]">
 *   <fa-surface fa-touchend="touchEnd($event)" fa-background-color="'red'"></fa-surface>
 * </fa-modifier>
 * ```
 * ```javascript
 * var touchEndCounter = 0;
 * $scope.touchEnd = function($event) {
 *   touchEndCounter++;
 *   console.log($event);
 *   console.log("touchEnd: " + touchEndCounter);
 * };
 * ```
 *
 * ### Fa-touchend on an fa-view
 * `Fa-touchend` may be used on an `fa-view`.  The function expression bound to `fa-touchend` will be bound to the `fa-view`'s internal `_eventInput`, the aggregation point of all events received by the `fa-view`.  When it receives a `touchend` event, it will call the function expression bound to `fa-touchend`.
 *  
 * In the example below, the `fa-surface` pipes its Surface events to an instantied Famous Event Handler called `myEvents`.
 * `Fa-view` pipes from `myEvents`, receiving all events piped by the `fa-surface`.
 * 
 * When a touchend event occurs on the `fa-surface`, it is piped to the `fa-view`.  
 * `fa-touchend` defines a callback function in which to handle touchend events, and when it receives a touchend event, it calls `touchEnd()`. 
 * ```html
 * <fa-view fa-touchend="touchEnd($event)" fa-pipe-from="myEvents">
 *   <fa-modifier fa-size="[100, 100]">
 *     <fa-surface fa-pipe-to="myEvents"
 *                 fa-background-color="'orange'">
 *     </fa-surface>
 *   </fa-modifier>
 * </fa-view>
 * ```
 * ```javascript
 * var EventHandler = $famous['famous/core/EventHandler'];
 * $scope.myEvents = new EventHandler();
 * 
 * $scope.touchEnd = function($event) {
 *   console.log($event);
 *   console.log("fa-view receives the touchend event from the fa-surface, and calls $scope.touchEnd bound to fa-touchend");
 * };
 * ```
 */

angular.module('famous.angular')
  .directive('faTouchend', ['$parse', '$famousDecorator', function ($parse, $famousDecorator) {
    return {
      restrict: 'A',
      scope: false,
      compile: function() {
        return { 
          post: function(scope, element, attrs) {
            var isolate = $famousDecorator.ensureIsolate(scope);

            if (attrs.faTouchend) {
              var renderNode = (isolate.renderNode._eventInput || isolate.renderNode)

              renderNode.on("touchend", function(data) {
                var fn = $parse(attrs.faTouchend);
                fn(scope, {$event:data});
                if(!scope.$$phase)
                  scope.$apply();
              });

            }
          }
        }
      }
    };
  }]);
