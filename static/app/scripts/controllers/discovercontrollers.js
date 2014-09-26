app.controller('DiscoverListCtrl', ['$scope','Auth','Discover','Tag',
    function($scope,Auth,Discover,Tag){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discovery").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = {};
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
        $scope.keywords=[];
        $scope.tweetsFromApi={};
        var keyw=[];
        var list_of_tags={};
      $scope.isLoadingtweets=false;
      $scope.tweet_details={};
      $scope.mapshow=false;
      $scope.tweetsshow=true;
     // What to do after authentication
     $scope.runTheProcess = function(){
      $scope.mapshow=false;
      $scope.tweetsshow=true;
          $scope.tweets={};
          Discover.get_recent_tweets($scope,"recent");
          var kind = 'topics';
          var paramsTag = {'about_kind':kind};
        Tag.list($scope,paramsTag);
      console.log($scope.tags);
     };
     // We need to call this to refresh token when user credentials are invalid
     $scope.refreshToken = function() {
            Auth.refreshToken();
     };
     $scope.showNewTagForm=function(){
            $scope.showNewTag=true;
            $( window ).trigger( 'resize' );  
          }
          $scope.hideNewTagForm=function(){
            $scope.showNewTag=false;
            $( window ).trigger( 'resize' ); 
          }
          $scope.hideTagFilterCard=function(){
            $scope.showTagsFilter=false;
            $( window ).trigger( 'resize' ); 
          }

     $scope.listTags=function(){
      var paramsTag = {'about_kind':'topics'}
      Tag.list($scope,paramsTag);
     };
     $scope.addNewtag = function(tag){
      $scope.isLoading = true;
      keyw.push(tag.name);
      for (var id in $scope.tags){
          keyw.push($scope.tags[id].name);
        }

       list_of_tags={"value":keyw};

       var params = {
                          'name': tag.name,
                          'about_kind':'topics',
                          'color':tag.color.color,
                          'order':'recent'
                      };
       //Tag.insert($scope,params);
       Discover.tag_insert($scope, params)
        $scope.tag.name='';
        $scope.tag.color= {'name':'green','color':'#BBE535'};
        var paramsTag = {'about_kind':'topics'};
        Tag.list($scope,paramsTag);
        //$scope.runTheProcess();
     }

     $scope.updateTag = function(tag){
            params ={ 'id':tag.id,
                      'title': tag.name,
                      'status':tag.color
            };
      Tag.patch($scope,params);
  };
  $scope.deleteTag=function(tag){
          params = {
            'entityKey': tag.entityKey
          }
          
          Tag.delete($scope,params);
          $scope.tweets={};
          Discover.get_recent_tweets($scope,"recent");
          console.log(tag.name);
          Discover.delete_tweets(tag.name);
          //Discover.delete_tweets();
          $scope.runTheProcess();

      };

  $scope.popular_tweets=function(){
          $scope.mapshow=false;
      $scope.tweetsshow=true;
         $scope.tweets={};
         Discover.get_recent_tweets($scope,"popular");

          var paramsTag = {'about_kind':'topics'};
        Tag.list($scope,paramsTag);   
        };

$scope.selectTag= function(tag,index,$event){
          
          if(!$scope.manage_tags){
         var element=$($event.target);
         if(element.prop("tagName")!='LI'){
              element=element.parent();
              element=element.parent();
         }
         var text=element.find(".with-color");
         if($scope.selected_tags.indexOf(tag) == -1){
            $scope.selected_tags.push(tag);
            /*element.css('background-color', tag.color+'!important');
            text.css('color',$scope.idealTextColor(tag.color));*/

         }else{
          /*  element.css('background-color','#ffffff !important');*/
            $scope.selected_tags.splice($scope.selected_tags.indexOf(tag),1);
             /*text.css('color','#000000');*/
         }
         ;
         $scope.filterByTags($scope.selected_tags);

      }

    };
  $scope.filterByTags = function(selected_tags){

        var tags_list=[];
        $scope.isFiltering = true;
        if (selected_tags.length>0){


        for (var id in selected_tags){
          $scope.tweets={};
          tags_list[id]=selected_tags[id].name;

        }
        console.log(tags_list);
         var tags = [];
         //console.log($scope.tweetsFromApi);
         for (var tweet in tweetts=$scope.tweetsFromApi){
          console.log(tweetts[tweet].topic);
          //

          console.log(selected_tags.indexOf(tweetts[tweet].topic));
          if (tags_list.indexOf(tweetts[tweet].topic) >= 0) {
            $scope.tweets[tweet]=tweetts[tweet];
    //do something
          }
          
         }
       }else{
        $scope.tweets=$scope.tweetsFromApi;
       }
        
      
       console.log($scope.tweets);
  };

$scope.unselectAllTags= function(){
        $('.tags-list li').each(function(){
            var element=$(this);
            var text=element.find(".with-color");
             element.css('background-color','#ffffff !important');
             text.css('color','#000000');
        });
     };
//HKA 19.02.2014 When delete tag render account list
 $scope.tagDeleted = function(){
    $scope.listcontacts();

 };
 $scope.manage=function(){
        $scope.unselectAllTags();
      };
$scope.tag_save = function(tag){
          if (tag.name) {
             Tag.insert($scope,tag);

           };
      };

$scope.editTag=function(tag){
        $scope.edited_tag=tag;
     }
$scope.doneEditTag=function(tag){
        $scope.edited_tag=null;
        $scope.updateTag(tag);
     }
$scope.addTags=function(){
      var tags=[];
      var items = [];
      tags=$('#select2_sample2').select2("val");

      angular.forEach($scope.selected_tasks, function(selected_task){
          angular.forEach(tags, function(tag){
            var edge = {
              'start_node': selected_task.entityKey,
              'end_node': tag,
              'kind':'tags',
              'inverse_edge': 'tagged_on'
            };
            items.push(edge);
          });
      });

      params = {
        'items': items
      }

      Edge.insert($scope,params);
      $('#assigneeTagsToTask').modal('hide');

     };

     var handleColorPicker = function () {
          if (!jQuery().colorpicker) {
              return;

          }
          $('.colorpicker-default').colorpicker({
              format: 'hex'
          });
      }
      handleColorPicker();

      $('#addMemberToTask > *').on('click', null, function(e) {
            e.stopPropagation();
        });
      $scope.idealTextColor=function(bgColor){
        var nThreshold = 105;
         var components = getRGBComponents(bgColor);
         var bgDelta = (components.R * 0.299) + (components.G * 0.587) + (components.B * 0.114);

         return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";
      }
      function getRGBComponents(color) {

          var r = color.substring(1, 3);
          var g = color.substring(3, 5);
          var b = color.substring(5, 7);

          return {
             R: parseInt(r, 16),
             G: parseInt(g, 16),
             B: parseInt(b, 16)
          };
      }
      $scope.dragTag=function(tag){
        $scope.draggedTag=tag;
         //$scope.$apply();
      };
      $scope.dropTag=function(contact,index){
        var items = [];

        var params = {
              'parent': contact.entityKey,
              'tag_key': $scope.draggedTag.entityKey
        };
        $scope.draggedTag=null;
        Tag.attach($scope,params,index);

      };
      $scope.tagattached=function(tag,index){
          if ($scope.contacts[index].tags == undefined){
            $scope.contacts[index].tags = [];
          }
           var ind = $filter('exists')(tag, $scope.contacts[index].tags);
           if (ind == -1) {
                $scope.contacts[index].tags.push(tag);
                var card_index = '#card_'+index;
                $(card_index).removeClass('over');
            }else{
                 var card_index = '#card_'+index;
                $(card_index).removeClass('over');
            }

              $scope.$apply();
      };

  // HKA 12.03.2014 Pallet color on Tags
      $scope.checkColor=function(color){
        $scope.tag.color=color;
      }
 //HKA 19.06.2014 Detache tag on contact list
     $scope.dropOutTag=function(){


        var params={'entityKey':$scope.edgekeytoDelete}
        Edge.delete($scope,params);

        $scope.edgekeytoDelete=undefined;
        $scope.showUntag=false;
      };
      $scope.dragTagItem=function(edgekey){
        $scope.showUntag=true;
        $scope.edgekeytoDelete=edgekey;
      };

     $scope.listNextPageItems = function(){
        
        
        var nextPage = $scope.currentPage + 1;
        var params = {};
          if ($scope.pages[nextPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[nextPage]
                     }
          }else{
            params = {'limit':7}
          }
          console.log('in listNextPageItems');
          $scope.currentPage = $scope.currentPage + 1 ; 
          User.list($scope,params);
     }
     $scope.listPrevPageItems = function(){
       
       var prevPage = $scope.currentPage - 1;
       var params = {};
          if ($scope.pages[prevPage]){
            params = {'limit':7,
                      'pageToken':$scope.pages[prevPage]
                     }
          }else{
            params = {'limit':7}
          }
          $scope.currentPage = $scope.currentPage - 1 ;
          User.list($scope,params);
     }
    

     
     $scope.showModal = function(){
        console.log('button clicked');
        $('#addAccountModal').modal('show');

      };
      
    $scope.addNewUser = function(user){
      console.log('add a new user');
      console.log(user);
      $('#addAccountModal').modal('hide');
      User.insert($scope,user);
    };
    

    $scope.getPosition= function(index){
        if(index<4){
         
          return index+1;
        }else{
          return (index%4)+1;
        }
     };

     
   


     $scope.showMaps= function(){
           $scope.tweetsshow=false;
      $scope.mapshow=true;


        Discover.get_location($scope);
        
     };
$scope.initialize= function(values){

           var mapOptions = {
            zoom: 2,
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            center: new google.maps.LatLng(15.363882, 11.044922)
          };
          console.log("sssssss")
          console.log(values)
          var lat=[];
          var lon=[];
          if (values ) {
            for (var i = 0; i < values.length; i++) {
             lat.push(values[i]['latitude']);
            lon.push(values[i]['longitude']);          
          }
          console.log(lat);
        }
          
          var map = new google.maps.Map(document.getElementById('map-canvas'),
              mapOptions);
 
         

          for (var i = 0; i < values.length ; i++) {
             var marker = new google.maps.Marker({
              position: new google.maps.LatLng(values[i]['latitude'], values[i]['longitude']),
              map: map
            });


            marker.setTitle(values[i]['location']);
            $scope.adddialgo(marker,values[i]['number'],values[i]['location'])

            //var message = [values[i][0]];
          



          }

       

};
$scope.adddialgo= function (marker,val,location){

          var topics="";
          for (id in $scope.tweets){
            if(location==$scope.tweets[id].author_location){
              if (topics!=""){
                if (topics.indexOf($scope.tweets[id].topic) == -1) {
                  topics=topics+" and " + $scope.tweets[id].topic;
                }
            }else{
              topics=$scope.tweets[id].topic;
            }
          }

            }
          
          var infowindow = new google.maps.InfoWindow({

            content: val+' tweets from '+location+ " related to " + topics
          });
          


          google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(marker.get('map'), marker);
          });
};




   
  // Google+ Authentication 
    Auth.init($scope);
    $(window).scroll(function() {
            if (!$scope.isLoading && !$scope.isFiltering && ($(window).scrollTop() > $(document).height() - $(window).height() - 100)) {
                $scope.listMoreItems();
            }
        });
    
}]);


app.controller('DiscoverNewCtrl', ['$scope','Auth','Discover','Tag',
    function($scope,Auth,Discover,Tag){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discover").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = {};
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
         $scope.topic="";

     // What to do after authentication
     $scope.runTheProcess = function(){
          
     };
     $scope.addNewTopic=function(){
      console.log($scope.topic);
      var params = {
                          'name': $scope.topic,
                          'about_kind':'topics',
                          'color':$scope.tag.color.color
                      };
      console.log(params);
       Tag.insert($scope,params);
        window.location.replace('#/discovers/');
      
     }


  // Google+ Authentication 
    Auth.init($scope);
    
}]);


app.controller('DiscoverShowCtrl', ['$scope','Auth','Discover','Tag',
    function($scope,Auth,Discover,Tag){

     $("ul.page-sidebar-menu li").removeClass("active");
        $("#id_Discover").addClass("active");
        document.title = "Discovery: Home";
        $scope.selectedTab=2;
        $scope.selectedOption = 'all';
        $scope.isSignedIn = false;
        $scope.immediateFailed = false;
        $scope.nextPageToken = undefined;
        $scope.prevPageToken = undefined;
        $scope.isLoading = false;
        $scope.isMoreItemLoading = false;
        $scope.pagination = {};
        $scope.currentPage = 01;
        $scope.pages = [];
        $scope.accounts = [];
        $scope.account = {};
        $scope.selected_tags = [];
        $scope.account.access = 'public';
        $scope.order = '-updated_at';
        $scope.account.account_type = 'Customer';
        $scope.draggedTag = null;
        $scope.tag = {};
        $scope.tweets = {};
        $scope.testtitle = "Customer Support Customer Support";
        $scope.showNewTag = false;
        $scope.showUntag = false;
        $scope.edgekeytoDelete = undefined;
        //Manage Color
        $scope.color_pallet = [
            {'name': 'red', 'color': '#F7846A'},
            {'name': 'orange', 'color': '#FFBB22'},
            {'name': 'yellow', 'color': '#EEEE22'},
            {'name': 'green', 'color': '#BBE535'},
            {'name': 'blue', 'color': '#66CCDD'},
            {'name': 'gray', 'color': '#B5C5C5'},
            {'name': 'teal', 'color': '#77DDBB'},
            {'name': 'purple', 'color': '#E874D6'},
        ];
        $scope.tag.color = {'name': 'green', 'color': '#BBE535'};
        $scope.selectedAccount=null;
         $scope.currentAccount=null;
         $scope.showTagsFilter=false;
         $scope.showNewTag=false;
         $scope.topic="";
         $scope.tweet_details={};


     // What to do after authentication
     $scope.runTheProcess = function(){
      console.log("begggggggggggggggggg");
      var url=document.URL;
      if (url.indexOf("*")>-1){
        url=url.replace("*","");
        $scope.selectedTab=1;
      }
      var tweet_id=url.substring(url.indexOf("show")+5,url.indexOf("topic-"));
      console.log("cnttttttttttttt");
      console.log(tweet_id);
      var topic=url.substring(url.indexOf("topic-")+6);
      Discover.get_tweets_details($scope,tweet_id,topic);
      console.log("finnnnnnnnnn");

     };



  // Google+ Authentication 
    Auth.init($scope);
    
}]);
