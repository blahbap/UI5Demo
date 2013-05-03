var myModule = angular.module('transportList', []);

myModule.controller("allTransportsListController", function($scope, $http) {

	$http.get('/sap/bc/resources/transports').success(
			function(data, status, headers, config) {
				$scope.transports = data.itab;
				$scope.noOfRows = $scope.transports.length;
			});

});

myModule.controller("graphTransportsListController", function($scope, $http) {

	$scope.transportData = {
		labels : [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
				"Jul", "Aug", "Sep", "Oct", "Nov",
				"Dec" ],
		datasets : [ {
			fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
			pointColor : "rgba(220,220,220,1)",
			pointStrokeColor : "#fff",
			data : []
		} ]
	};

	$scope.dumpData = { 
			labels : [ ],	
			datasets : [ {
				fillColor : "rgba(220,220,220,0.5)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				data : []
			} ]
		};

	$http.get('/sap/bc/resources/transports/graph').success(
			function(data, status, headers, config) {

				
				var year2011 = [];
				var year2012 = [];
				for ( var i = 0; i < 12; i++) {
					year2011.push(data.itab[i].count);
				};
				
				for ( i = 12; i < 24; i++) {
					year2012.push(data.itab[i].count);
				};

				$scope.transportData = {
					labels : [ "Jan", "Feb", "Mar", "Apr", "May",
							"Jun", "Jul", "Aug", "Sep", "Oct",
							"Nov", "Dec" ],
					datasets : [ {
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : year2011
					}, 
					{
						fillColor : "rgba(151,187,205,0.5)",
						strokeColor : "rgba(151,187,205,1)",
						pointColor : "rgba(151,187,205,1)",
						pointStrokeColor : "#fff",
						data : year2012
					}
					
					]
				};
	});

	$http.get('/sap/bc/resources/transports/dumps').success(
			function(data, status, headers, config) {

				
				var count = []; 
				for ( var i = 0; i < data.itab.length; i++) {
					count.push(data.itab[i].count); 
				}
				
				var labels = []; 
				for ( var i = 0; i < data.itab.length; i++) {
					labels.push((i+1).toString()); 
				}
				
				$scope.dumpData = { 
					labels : labels,	
					datasets : [ {
						fillColor : "rgba(220,220,220,0.5)",
						strokeColor : "rgba(220,220,220,1)",
						pointColor : "rgba(220,220,220,1)",
						pointStrokeColor : "#fff",
						data : count
					} 					
					]
				};
	});

	

});

myModule.directive('linechart', function() {
	return {
		restrict : 'C',
		replace : true,
		template : '<canvas id="line" width="350px" height="350px">' + '</canvas>',
		// The linking function will add behavior to the template
		link : function(scope, element, attrs) {

			scope.$watch('transportData', function(newVal, oldVal) {
				var ctx = element.get(0).getContext("2d");
				var myNewChart = new Chart(ctx).Line(scope.transportData);
			});

		}
	};
});

myModule.directive('piechart', function() {
	return {
			restrict : 'C',
			scope: {},
			replace : true,
			template : '<canvas id="pie" width="350px" height="350px">' + '</canvas>',
			// The linking function will add behavior to the template
			link : function(scope, element, attrs) {
				var ctx = element.get(0).getContext("2d");
				var data = jQuery.parseJSON( attrs.model );
				var myNewChart = new Chart(ctx).Pie(data);
		}
	}
});

myModule.directive('barchart', function() {
	return {
		restrict : 'C',
		replace : true,
		template : '<canvas id="bar" width="350px" height="350px">' + '</canvas>',
		// The linking function will add behavior to the template
		link : function(scope, element, attrs) {

			scope.$watch('dumpData', function(newVal, oldVal) {
				var ctx = element.get(0).getContext("2d");
				var myNewChart = new Chart(ctx).Bar(scope.dumpData);
			});

		}
	};
});


myModule.controller("myTransportsListController", function($scope, $http) {

	$scope.transports = [];

	$http.get('/sap/bc/resources/transports/me').success(
			function(data, status, headers, config) {
				$scope.transports = data.itab;
				$scope.noOfRows = $scope.transports.length;
			});

	$scope.getRowClass = function(index) {
		if ($scope.transports[index].approval_status === "approved"
				&& $scope.transports[index].phase === "4. BUILD & TEST") {
			return "success";
		}
	}
});
