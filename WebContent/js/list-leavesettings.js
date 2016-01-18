angular
		.module('list-leavesettings', [ 'ngResource' ])
		.controller(
				'list-leavesettings',
				[
						'$scope',
						'$http',
						'leavesettingService',
						function($scope, $http, leavesettingService) {
							var lastState = {
								pagination : {
									start : 0,
									number : 10
								},
								sort : {
									predicate : 'id',
									reverse : false
								},
								search : {
									predicateObject : {}
								}
							};
							
							var queryParams = function(tableState){
								var pagination = tableState.pagination;
								var start = pagination.start || 0;
								var pageSize = pagination.number || 10;
								var sort = tableState.sort.predicate;
								var dir = tableState.sort.reverse ? 'DESC'
										: 'ASC';
								var predicate = tableState.search.predicateObject;
								var page = (start / pageSize);
								if (page < 0) {
									page = 0;
								}
								lastState.pagination.start = start;
								lastState.pagination.number = pageSize;
								lastState.sort.predicate = sort;
								lastState.sort.reverse = tableState.sort.reverse;
								lastState.search = tableState.search;
								var filters = tableState.search.predicateObject
										|| {};
								filters.sort = sort;
								filters.pageSize = pageSize;
								filters.page = page;
								filters.dir = dir;
								return filters;
							}
							
							$scope.displayed = [];
							$scope.callServer = function callServer(tableState) {
								$scope.isLoading = true;
								
								var filters = queryParams(tableState);
								leavesettingService
										.list(filters)
										.then(
												function(status) {
													$scope.displayed = status.data.content;
													tableState.pagination.numberOfPages = status.data.totalPages;
													$scope.isLoading = false;
												});
							};

							$scope.removeEntry = function(newsEntry) {
								if (confirm("Are you sure to delete leavesetting: "
										+ newsEntry.name) == true) {
									$scope.isLoading = true;
									leavesettingService
											.remove(newsEntry.id)
											.then(
													function(status) {
														var pagination = lastState.pagination;
														var start = pagination.start || 0;
														var pageSize = pagination.number || 10;
														var sort = lastState.sort.predicate;
														var dir = lastState.sort.reverse ? 'DESC'
																: 'ASC';
														var page = (start / pageSize);
														if (page < 0) {
															page = 0;
														}

														var filters = queryParams(lastState);

														leavesettingService
																.list(filters)
																.then(
																		function(
																				status) {
																			$scope.displayed = status.data.content;
																			$scope.isLoading = false;
																		});
													});

								}
							};
						} ]).factory(
								'leavesettingService',
								[
										'$http',
										function($http) {
											var serviceBase = 'rest/leavesettings/';
											var obj = {};
											obj.list = function(queries) {
												return $http.get(serviceBase, {params:queries});
											};

											obj.get = function(id) {
												return $http.get(serviceBase  + id);
											};
											
											obj.insert = function(leavesetting) {
												return $http.post(serviceBase, leavesetting).then(
														function(results) {
															return results;
														});
											};

											obj.update = function(id, leavesetting) {
												return $http.put(serviceBase  + id,
														leavesetting).then(function(results) {
													return results;
												});
											};
											
											obj.remove = function(id) {
												return $http.delete(serviceBase + id).then(function(status) {
													return status;
												});
											};

											return obj;
										} ]);