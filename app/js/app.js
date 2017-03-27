angular.module("app", [])
.directive("picklist", picklist)
.controller("ExtController", function($scope, $http, $rootScope) {
    $scope.control = {};

    $http.get("app/groups.json").then(function(res) {
        $scope.groups = [];
        res.data.forEach(function(item) {
            if(item.active) {
                $scope.groups.push(item);
            }
        });

        $http.get("app/features.json").then(function(res) {
            $scope.features = [];
            res.data.forEach(function(item) {
                if(item.active) {
                    $scope.features.push(item);
                }
            });

            $rootScope.$broadcast("dataLoaded", { groups: $scope.groups, features: $scope.features });
        });
    });
});

function picklist() {
    return {
        replace: true,
        template: "<div class='picklist'>"
                + "    <div class='btn-group all-group'>"
                + "        <button ng-repeat='group in groups' type='button' class='btn btn-default {{ data.selectedGroup == group ? \"selected-group\" : \"\"  }}' ng-click='switchToGroup(group.value)'>{{group.label}}</button>"
                + "    </div>"
                + "    <div class='panel'>"
                + "        <select multiple size='15' class='left-list' ng-model='data.selectedItemsLeft'>"
                + "            <option ng-repeat='feature in data.featuresInGroup' value='{{feature.value}}'>{{feature.label}}</option>"
                + "        </select>"
                + "        <div class='buttons'>"
                + "            <span class='glyphicon glyphicon-chevron-left' ng-click='toLeft()'></span>"
                + "            <span class='glyphicon glyphicon-chevron-right' ng-click='toRight()'></span>"
                + "        </div>"
                + "        <select multiple size='15' class='right-list' ng-model='data.selectedItemsRight'>"
                + "            <option ng-repeat='feature in data.selectedFeatures' value='{{feature.value}}'>{{feature.label}}</option>"
                + "        </select>"
                + "    </div>"
                + "</div>",
        restrict: "E",
        scope: {
            groups: "=",
            features: "=",
            control: "="
        },
        controller: function($scope, $element, $attrs, $parse) {
            $scope.init = init;
            $scope.switchToGroup = switchToGroup;
            $scope.toLeft = toLeft;
            $scope.toRight = toRight;

            $scope.init();
        },
        link: function($scope, $element, $attrs) {
            $scope.$on("dataLoaded", function(event, data) {
                $scope.groups = data.groups;
                $scope.features = data.features;
                $scope.init();
            });
        },
    };
}

function init() {
    $scope = this;
    $scope.data = {};
    $scope.data.selectedGroup = null;
    $scope.data.featuresInGroup = [];
    $scope.data.selectedFeatures = [];
    $scope.data.selectedItemsLeft = [];
    $scope.data.selectedItemsRight = [];

    $scope.internalControl = $scope.control || {};
    $scope.internalControl.save = function() {
        // Persist the selected features into session storage
        var selections = $scope.data.selectedFeatures.map(function(item) {
            return item.value;
        });
        sessionStorage.selections = angular.toJson(selections);
        alert("Selections saved to session storage.");
    };
    $scope.internalControl.load = function() {
        // Load from session storage
        var selections = angular.fromJson(sessionStorage.selections);

        if(selections && selections.length > 0) {
            $scope.data.selectedFeatures.length = 0;
            $scope.features.forEach(function(item) {
                if(selections.includes(item.value)) {
                    $scope.data.selectedFeatures.push(item);
                }
            });
        }
    }

    if($scope.groups && $scope.groups.length > 0) {
        $scope.internalControl.load();
        $scope.switchToGroup($scope.groups[0].value);
    }
}

function toLeft() {
    $scope = this;

    var featuresToDelete = [];
    $scope.data.selectedFeatures.forEach(function(item) {
        if($scope.data.selectedItemsRight.includes(item.value)) {
            featuresToDelete.push(item);
        }
    });
    featuresToDelete.forEach(function(item) {
        var idx = $scope.data.selectedFeatures.indexOf(item);
        if(idx >= 0) {
            $scope.data.selectedFeatures.splice(idx, 1);
        }
    });

    var groupIdx = $scope.groups.indexOf($scope.data.selectedGroup);

    $scope.data.featuresInGroup.length = 0;
    $scope.features.forEach(function(item) {
        if(item.validFor == groupIdx) {
            if(!$scope.data.selectedFeatures.includes(item)) {
                $scope.data.featuresInGroup.push(item);
            }
        }
    });
}

function toRight() {
    $scope = this;
    $scope.data.featuresInGroup.forEach(function(item) {
        if($scope.data.selectedItemsLeft.includes(item.value)) {
            $scope.data.selectedFeatures.push(item);
        }
    });

    $scope.data.selectedFeatures.forEach(function(item) {
        var idx = $scope.data.featuresInGroup.indexOf(item);
        if(idx >= 0) {
            $scope.data.featuresInGroup.splice(idx, 1);
        }
    });
}

function switchToGroup(value) {
    $scope = this;
    var groupIdx = -1;
    for(var i in $scope.groups) {
        var group = $scope.groups[i];
        if(value == group.value) {
            groupIdx = i;
            break;
        }
    }

    if(groupIdx < 0) {
        return;
    }

    $scope.data.selectedGroup = $scope.groups[groupIdx];

    $scope.data.featuresInGroup.length = 0;
    $scope.features.forEach(function(item) {
        if(item.validFor == groupIdx) {
            if(!$scope.data.selectedFeatures.includes(item)) {
                $scope.data.featuresInGroup.push(item);
            }
        }
    });
}
