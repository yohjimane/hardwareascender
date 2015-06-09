HardwareAscender.controller('HomeCtrl', ['$scope', '$resource', 'UserService', function($scope, $resource, UserService){

  $scope.userService = UserService;

  console.log("home controller loaded")
  $scope.listings = [];

  $scope.loadListings = function(){
    io.socket.get('/api/listing/', function(data, jwRes){
      $scope.$evalAsync(function(){
        $scope.listings = data
        $scope.listings.forEach(function(listing){
          listing.updatedAt = new Date(listing.updatedAt)
          var time = new Date();
          listing.time = ((time - listing.updatedAt)/1000)
          console.log('listing time:',listing.time)
          if (listing.time > 3600 * 24){
            listing.timestamp = Math.floor(((listing.time/60)/60)/24) + " days ago"
          }else if (listing.time > 3600){
            listing.timestamp = Math.floor((listing.time/60)/60) + " hours ago"
          }else if (listing.time > 60){
            listing.timestamp = Math.floor(listing.time/60) + " minutes ago"
          }else{
            listing.timestamp = "less than a minute ago"
          }
        })
      })
      console.log('data', data)
    })
  }
  $scope.loadListings();

  io.socket.on('listing', function(msg){
    console.log('Message:',msg);
    if (msg && msg.verb){
      switch(msg.verb){
        case 'created':
          $scope.$evalAsync(function(){
            $scope.listings.push(msg.data)
          })
        break;
        case 'destroyed':
          $scope.$evalAsync(function(){
            for(var i=0; i<$scope.listings.length; i++){
              if($scope.listings[i].id == msg.id){
                $scope.listings.splice(i, 1)
              }
            }
          })
        break;
        case 'updated':
          $scope.$evalAsync(function(){
            for(var i=0; i<$scope.listings.length; i++){
              if($scope.listings[i].id == msg.id){
                for(var key in msg.data){
                  $scope.listings[i][key] == msg.data[key]
                }
                break;
              }
            }
          })
        break;
      }
    }
  })

  // $scope.deleteContact = function(contactId){
  //   Listing.delete({id:contactId}, function(data){
  //     AlertService.add('danger', 'Contact Deleted!')
  //   });
  // };

  // $scope.showContact = function(contactId){
  //   Listing.get({id:contactId}, function(data){
  //     console.log(data)
  //   });
  // };

  // $scope.createContact = function(){
  //   var contact = new Listing();
  //   contact.firstName = "Test"
  //   contact.lastName = "Test"
  //   contact.email = "Test"
  //   contact.address ="Test"
  //   contact.city ="Test"
  //   contact.state ="Test"
  //   contact.zip ="12321"
  //   contact.phone ="Test"
  //   contact.notes ="Test"
  //   contact.$save(function(data){
  //     console.log(data);
  //     $scope.loadListing();
  //   });
  // };

  // $scope.openEditModal = function(contactId){
  //   $scope.contactId = contactId
  //   $modal.open({
  //     templateUrl: '/views/editContactModal.html',
  //     controller: 'EditContactModal',
  //     resolve: {
  //       contact: function(){
  //         return $scope.contactId
  //       }
  //     }
  //   })
  // }


}]);
