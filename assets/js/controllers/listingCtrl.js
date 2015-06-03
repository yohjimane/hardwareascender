HardwareAscender.controller('ListingCtrl', ['$scope', '$resource', 'Listings', 'UserService', '$location', '$routeParams', '$mdDialog', function($scope, $resource, Listings, UserService, $location, $routeParams, $mdDialog){
  console.log('listing controller loaded')
  $scope.UserService = UserService;

  $scope.$watchCollection('UserService',function(){
    $scope.currentUser = $scope.UserService.currentUser;
  })

  $scope.categories = ['CPU (Processor)', 'CPU Cooler', 'Motherboard', 'Memory (RAM)', 'Storage (HDD, SSD, RAM Disk)', 'GPU (Video Card)', 'Case', 'PSU (Power Supply)', 'Optical Drive', 'Monitor', 'External Storage', 'Peripherals (e.g. Mouse, Keyboard, Headphones...)', 'Accessories/Other (e.g. Fans, Thermal Paste)']

  // Contacts.get({id: $routeParams.id}, function(data){
  //   $scope.contact = data;
  // })
  $scope.createListing = function(){
    console.log('trying to create listing')
    var listing = new Listings();
    listing.user = $scope.currentUser;
    listing.brand = $scope.brand;
    listing.desc = $scope.desc;
    listing.title = $scope.title;
    listing.category = $scope.category
    listing.price = $scope.price;
    listing.status = false;
    console.log(listing)
    listing.$save(function(data){
      console.log('listing added!', data)
      $scope.title = "";
      $scope.brand = "";
      $scope.category = "";
      $scope.desc = "";
      $scope.price = "";
      $scope.goTo('/')
    })

    $scope.goTo = function(path){
      $location.path(path);
    };
  }

  Listings.get({id: $routeParams.id}, function(data){
    $scope.listing = data;
  })

  $scope.showQuestion = function(event) {
    $mdDialog.show({
      controller: 'messageCtrl',
      templateUrl: 'templates/questionModalTmpl.html',
      targetEvent: event,
    })
  };

  $scope.showOffer = function(event) {
    $mdDialog.show({
      controller: 'messageCtrl',
      templateUrl: 'templates/offerModalTmpl.html',
      targetEvent: event,
    })
  };

  $scope.sendOffer = function(offer){
    io.socket.post('/api/user/'+$scope.listing.user.id+'/messages', {title:$scope.currentUser.username+' is offering to buy '+$scope.listing.title+'!', body:$scope.currentUser.username+' wants to buy '+$scope.listing.title+' for your listing price!', type:'buy', offer:offer, listing: $scope.listing.id}, function(data){
      $scope.$evalAsync(function(){
      if (data){
          console.log('offer sent',data)
        }else{
          console.log('error!', data)
        }
      })
    })
  };

}]);