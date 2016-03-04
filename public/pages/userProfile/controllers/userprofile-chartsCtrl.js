angular.module('App.userprofile-chartsCtrl',['ngAnimate', 'ui.bootstrap'
  ])
  .controller('userprofile-chartsCtrl', function($scope, $http, $uibModal, $log, $state, appFactory, userProfileFactory){

    $scope.animationsEnabled = true;

    $scope.open = function (size) {

      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'myModalCharts.html',
        controller: 'ModalChartsCtrl',
        size: size
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
    
  });

angular.module('App.userprofile-chartsCtrl').controller('ModalChartsCtrl', function ($scope, $uibModalInstance, $http, appFactory, userProfileFactory, $location, $state) {

  $scope.deviceData = {};
  $scope.device = {};
  $scope.username;
  $scope.state = $state;
  $scope.errorMessage = '';
  $scope.showModal = false;
  $scope.invalidDeviceAlert = false;
  $scope.registeredAlert = false;
  $scope.addDeviceAlert = false;

  $(function() {
        Highcharts.setOptions({
          global: {
            useUTC: false
          }
        });
      })

      $scope.renderWaterChart = function() {
        userProfileFactory.getChartData('water').then(function(result){
          if(!result){
            $('#mainChart').html("<h4>This plant has no data</h4>");
          } else {
            var chartData = result.chartData.data.values;
            var currentDevice = result.deviceName;
            var waterData = [];

            for(var i = 0; i < chartData.length; i++){
                var year = parseInt(chartData[i].timestamp.slice(0,4));
                var month = parseInt(chartData[i].timestamp.slice(5,7)) - 1;
                var day = parseInt(chartData[i].timestamp.slice(8,10));
                var hour = parseInt(chartData[i].timestamp.slice(11,13));
                var min = parseInt(chartData[i].timestamp.slice(14,16));
                var sec = parseInt(chartData[i].timestamp.slice(17,19));
                waterData.unshift([Date.UTC(year, month, day, hour, min, sec), parseFloat((chartData[i].value).toFixed(2))]);
            }

            $(function() {
              $('#mainChart').highcharts({
                chart: {
                  type: 'area'
                },
                title: {
                  text: 'Moisture levels for'
                },
                subtitle: {
                  text: currentDevice
                },
                xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: {
                    hour: '%I %p',
                    minute: '%I:%M %p'
                  },
                  title: {
                    text: 'Time'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Level'
                  },
                  min: 0,
                  minRange: 800,
                  minorGridLineWidth: 0,
                  gridLineWidth: 0,
                  alternateGridColor: null,
                  plotBands: [{
                    from: 0,
                    to: 100,
                    color: 'rgba(255,0,0,0.3)',
                    label: {
                      text: 'Danger',
                      style: {
                        color: '#606060'
                      }
                    }
                  }, {
                    from: 101,
                    to: 400,
                    color: 'rgba(50,50,255,0)',
                    label: {
                      text: 'Dry',
                      style: {
                        color: '#606060'
                      }
                    }
                  }, {
                    from: 401,
                    to: 700,
                    color: 'rgba(50,50,255,0.05)',
                    label: {
                      text: 'Perfect',
                      style: {
                        color: '#606060'
                      }
                    }
                  }, {
                    from: 701,
                    to: 1020,
                    color: 'rgba(50,50,255,0.1)',
                    label: {
                      text: 'Drenched',
                      style: {
                        color: '#606060'
                      }
                    }
                  }]
                },
                tooltip: {
                  valueDecimals: 0,
                  headerFormat: '{point.x:%b %e, %Y}<br>',
                  pointFormat: '{point.x:%I:%M %p} <b><font color="#F5A9A9">{point.y}</font></b>'
                },
                plotOptions: {
                  area: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                series: [{
                  color: '#819FF7',
                  name: 'Moisture level',
                  data: waterData
                }]
              });
            });
          }
        })
      }

      $scope.renderLightChart = function() {
        userProfileFactory.getChartData('light').then(function(result){
          if(!result){
            $('#mainChart').html("<h4>This plant has no data</h4>");
          } else {
            var chartData = result.chartData.data.values;
            var currentDevice = result.deviceName;
            var lightData = [];

            for(var i = 0; i < chartData.length; i++){
              var year = parseInt(chartData[i].timestamp.slice(0,4));
              var month = parseInt(chartData[i].timestamp.slice(5,7)) - 1;
              var day = parseInt(chartData[i].timestamp.slice(8,10));
              var hour = parseInt(chartData[i].timestamp.slice(11,13));
              var min = parseInt(chartData[i].timestamp.slice(14,16));
              var sec = parseInt(chartData[i].timestamp.slice(17,19));
              lightData.unshift([Date.UTC(year, month, day, hour, min, sec), parseFloat((chartData[i].value).toFixed(2))]);
            }

            $(function() {
              $('#mainChart').highcharts({
                chart: {
                  type: 'area'
                },
                title: {
                  text: 'Light levels for'
                },
                subtitle: {
                  text: currentDevice
                },
                xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: { // don't display the dummy year
                    hour: '%I %p',
                    minute: '%I:%M %p'
                  },
                  title: {
                    text: 'Time'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Level'
                  },
                  min: 0,
                  minRange: 800,
                  minorGridLineWidth: 0,
                  gridLineWidth: 0,
                  alternateGridColor: null,
                  plotBands: [{
                    from: 1,
                    to: 339,
                    color: 'rgba(128,128,128,0.3)',
                    label: {
                      text: 'Shady',
                      style: {
                        color: '#606060'
                      }
                    }
                  }, {
                    from: 340,
                    to: 680,
                    color: 'rgba(128,128,128,0.2)',
                    label: {
                      text: 'Partially sunny',
                      style: {
                        color: '#606060'
                      }
                    }
                  }, {
                    from: 681,
                    to: 1050,
                    color: 'rgba(128,128,128,0.1)',
                    label: {
                      text: 'Sunny',
                      style: {
                        color: '#606060'
                      }
                    }
                  }]
                },
                tooltip: {
                  valueDecimals: 0,
                  headerFormat: '{point.x:%b %e, %Y}<br>',
                  pointFormat: '{point.x:%I:%M %p} <b><font color="#F5A9A9">{point.y}</font></b>'
                },
                plotOptions: {
                  area: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                series: [{
                  color: '#F3F781',
                  name: 'Light level',
                  data: lightData
                }]
              });
            });
          }
        })
      }

      $scope.renderTempChart = function() {
        userProfileFactory.getChartData('temp').then(function(result){
          if(!result){
            $('#mainChart').html("<h4>This plant has no data</h4>");
          } else {
            var chartData = result.chartData.data.values;
            var currentDevice = result.deviceName;
            var tempData = [];

            for(var i = 0; i < chartData.length; i++){
              var year = parseInt(chartData[i].timestamp.slice(0,4));
              var month = parseInt(chartData[i].timestamp.slice(5,7)) - 1;
              var day = parseInt(chartData[i].timestamp.slice(8,10));
              var hour = parseInt(chartData[i].timestamp.slice(11,13));
              var min = parseInt(chartData[i].timestamp.slice(14,16));
              var sec = parseInt(chartData[i].timestamp.slice(17,19));
              tempData.unshift([Date.UTC(year, month, day, hour, min, sec), parseInt(chartData[i].value * 1.8 + 32)]);
            }

            $(function () {
              $('#mainChart').highcharts({
                chart: {
                  type: 'area'
                },
                title: {
                  text: 'Temperature for'
                },
                subtitle: {
                  text: currentDevice
                },
                xAxis: {
                  type: 'datetime',
                  dateTimeLabelFormats: { // don't display the dummy year
                    hour: '%I %p',
                    minute: '%I:%M %p'
                  },
                  title: {
                    text: 'Time'
                  }
                },
                yAxis: {
                  title: {
                    text: 'Degrees (°F)'
                  },
                  min: 0
                },
                tooltip: {
                  valueDecimals: 0,
                  headerFormat: '{point.x:%b %e, %Y}<br>',
                  pointFormat: '{point.x:%I:%M %p} <b><font color="#F5A9A9">{point.y}°F</font></b>'
                },
                plotOptions: {
                  area: {
                    marker: {
                      enabled: false
                    }
                  }
                },
                series: [{
                  color: '#FA5858',
                  name: 'Temperature',
                  data: tempData
                }]
              });
            });
          }
        })
      }

  $scope.toggleModal = function() {
    $scope.invalidDeviceAlert = false;
    $scope.registeredAlert = false;
    $scope.showModal = !$scope.showModal;
  };

  $scope.cancel = function() {
    $uibModalInstance.dismiss('cancel');
  };

  $scope.init = function() {
    appFactory.getUser().then(function(success){
      $scope.username = success.data.username;
    });
  }

  $scope.init();
})
