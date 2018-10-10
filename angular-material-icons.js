/*
 * angular-material-icons v0.7.2
 * (c) 2014 Klar Systems
 * License: MIT
 */

/* jshint -W097, -W101 */
'use strict';

angular.module('ngMdIcons', [])
    .directive('ngMdIcon', ['ngMdIconService', function (ngMdIconService) {
        var shapes = ngMdIconService.getShapes();

        return {
            restrict: 'AE',
            link: function(scope, element, attr) {

                var icon, size, viewBox;

                var render = function() {
                    // icon
                    if (attr.icon !== undefined) {
                        icon = attr.icon;
                        // Check for material-design-icons style name, and extract icon / size
                        var ss = icon.match(/ic_(.*)_([0-9]+)px.svg/m);
                        if (ss !== null) {
                            icon = ss[1];
                            size = ss[2];
                        }
                    } else {
                        icon = 'help';
                    }
                    // validate
                    if (shapes[icon] === undefined) {
                        icon = 'help';
                    }

                    // size
                    if (attr.size !== undefined) {
                        size = attr.size;
                    }
                    else if (size !== null) {
                        size = 24;
                    }

                    // viewBox
                    if (attr.viewBox !== undefined) {
                        viewBox = attr.viewBox;
                    }
                    else {
                        viewBox = ngMdIconService.getViewBox(icon) ? ngMdIconService.getViewBox(icon) : '0 0 24 24';
                    }

                    // render
                    element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + viewBox + '" width="' + size + '" height="' + size + '">' + shapes[icon] + '</svg>');
                };

                var replace = function(newicon) {
                    // validate
                    if (shapes[newicon] === undefined) {
                        newicon = 'help';
                    }
                    if (newicon === icon) { return; }
                    // render new and old icons (old icon will be shown by default)
                    element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '"><g id="' + newicon + '" style="display:none">' + shapes[newicon] + '</g><g id="' + icon + '" style="display:none">' + shapes[icon] + '</g></svg>');
                    // morph
                    var options = JSON.parse(attr.options || null);
                    try {
                        // this block will succeed if SVGMorpheus is available
                        new SVGMorpheus(element.children()[0]).to(newicon, options);
                    } catch (error) {
                        // fallback
                        element.html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' + size + '" height="' + size + '">' + shapes[newicon] + '</svg>');
                    }
                    icon = newicon;
                };

                var resize = function(newsize) {
                    if (newsize === size) { return; }
                    element.children()[0].setAttribute('width', newsize);
                    element.children()[0].setAttribute('height', newsize);
                    size = newsize;
                };

                // render the first time
                render();

                // watch for any changes
                if (attr.icon !== undefined) { attr.$observe('icon', replace); }
                if (attr.size !== undefined) { attr.$observe('size', resize);  }
            }
        };
    }])
    .provider('ngMdIconService', function () {
        var provider, service, shapes, viewBoxes;

        shapes = includedShapes();
        viewBoxes = {};

        service = {
            getShape : getShape,
            getShapes: getShapes,
            getViewBox : getViewBox,
            getViewBoxes: getViewBoxes,
            setShape : addShape,
            setShapes: addShapes,
            setViewBox : addViewBox,
            setViewBoxes: addViewBoxes,
            addShape : addShape,
            addShapes: addShapes,
            addViewBox : addViewBox,
            addViewBoxes: addViewBoxes
        };

        provider = {
            $get     : ngMdIconServiceFactory,
            getShape : getShape,
            getShapes: getShapes,
            getViewBox : getViewBox,
            getViewBoxes: getViewBoxes,
            setShape : addShape,
            setShapes: addShapes,
            setViewBox : addViewBox,
            setViewBoxes: addViewBoxes,
            addShape : addShape,
            addShapes: addShapes,
            addViewBox : addViewBox,
            addViewBoxes: addViewBoxes
        };

        return provider;

        function addShape(name, shape) {
            shapes[name] = shape;

            return provider; // chainable function
        }

        function addShapes(newShapes) {
            shapes = angular.extend(shapes, newShapes);

            return provider; // chainable function
        }

        function addViewBox(name, viewBox) {
            viewBoxes[name] = viewBox;

            return provider; // chainable function
        }

        function addViewBoxes(newViewBoxes) {
            viewBoxes = angular.extend(viewBoxes, newViewBoxes);

            return provider; // chainable function
        }

        function getShape(name) {
            return shapes[name];
        }

        function getShapes() {
            return shapes;
        }

        function getViewBox(name) {
            return viewBoxes[name];
        }

        function getViewBoxes() {
            return viewBoxes;
        }

        function includedShapes() {
            return /* GULP_SHAPES */;
        }

        function ngMdIconServiceFactory() {
            return service;
        }
    })
;
