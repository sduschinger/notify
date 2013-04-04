function NotifyAlbum(artist, albumtitle) {
    var self = this;
	
    self.artist = artist;
    self.albumtitle = albumtitle;
	self.available = false;
	self.url = "";
			
}

function User(userid, email) {
	var self = this;
	
	self.userid = userid;
	self.email = email;
}

function StorageObject(user, albums) {
	var self = this;
	self.userid = user.userid;
	self.email = user.email;
	self.albums = albums;
	
}

function NotifyCtrl($scope) {
	$scope.currentuser = new User("duschsba", "sebastian.duschinger@gmail.com");
	/*$scope.albums = [new NotifyAlbum("Bonobo", "Northern Borders"),
		new NotifyAlbum("The Strokes", "Comedown Machine"),
	];*/
		
	$scope.loadData = function() {
		console.log("Current user: " + $scope.currentuser.userid);
		console.log("Current user email: " + $scope.currentuser.email);
		$scope.loadRemote();		
	}
	
	$scope.addAlbum = function() {
		$scope.albums.push(new NotifyAlbum(jQuery.trim($scope.inputArtist), jQuery.trim($scope.inputAlbumtitle)));
		$scope.save();
		$scope.inputArtist = "";
		$scope.inputAlbumtitle = "";
		$scope.refresh();
		$('#inputArtist').focus();
	}
	
	$scope.save = function() {
		$scope.saveRemote();
		//$scope.saveLocal();
	}
  	
	$scope.saveLocal = function() {
		localStorage.notifyAlbums = JSON.stringify($scope.albums);
	}
	
	$scope.loadLocal = function() {
		$scope.albums = JSON.parse(localStorage.notifyAlbums);
		$scope.refresh();
	}
    
  $scope.saveRemote = function() {
	var so = new StorageObject($scope.currentuser, $scope.albums)
		
    $.ajax('http://localhost:8080/user?callback=?', {
      data : JSON.stringify(so),
      contentType : 'application/json',
      type : 'POST'
      })  
  }
  
    $scope.loadRemote = function() {
	 $.getJSON('http://localhost:8080/user/' + $scope.currentuser.userid, function(data) {
		//$scope.albums = data[0].albums;
		$scope.albums = [];
		$.each(data[0].albums, function(idx){
			var d = data[0].albums[idx];
			var newAlbum = new NotifyAlbum(d.artist, d.albumtitle);
			$scope.albums.push(newAlbum);
		});
		$scope.refresh();
	 });
  }
  
	$scope.delete = function(idx) {
		$scope.albums.splice(idx,1);
		$scope.save();
	}
	
	$scope.refresh = function() {
		$.each($scope.albums, function(index, album) {
			$.getJSON("http://ws.spotify.com/search/1/album?q=" + album.artist + " " + album.albumtitle, function(data) {
				
				if (data.albums.length > 0) {
					album.available = true;
					album.url = "http://open.spotify.com/album/" + data.albums[0].href.split(":")[2];
					$scope.$apply();
					
				}
			})			
			
		});
		$scope.save()
	}
	
}
