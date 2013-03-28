function NotifyAlbum(artist, albumtitle) {
    var self = this;
	
    self.artist = artist;
    self.albumtitle = albumtitle;
	self.available = false;
	self.url = "";
			
}


function NotifyCtrl($scope) {
	$scope.username = "Duschi";
	$scope.albums = [new NotifyAlbum("Bonobo", "Northern Borders"),
		new NotifyAlbum("The Strokes", "Comedown Machine"),
	];
	
	$scope.loadData = function() {
		$scope.load();
		/*$.getJSON("https://dl.dropbox.com/u/1265799/data.json?jsoncallback=?", function(data) {
			alert("Hurz");
			$scope.albums = json;
		}).error(function() { alert("error"); });*/
		
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
		localStorage.notifyAlbums = JSON.stringify($scope.albums);
	}
	
	$scope.load = function() {
		$scope.albums = JSON.parse(localStorage.notifyAlbums);
		$scope.refresh();
	}
  
  $scope.saveMongo = function() {
    
    $.ajax('http://localhost:8080/albums', {
      data : JSON.stringify($scope.albums),
      contentType : 'application/json',
      type : 'POST'
      });
  }
	
	$scope.delete = function(idx) {
		$scope.albums.splice(idx,1);
		$scope.save();
	}
	
	$scope.refresh = function() {
		$.each($scope.albums, function(index, album) {
			$.getJSON("http://ws.spotify.com/search/1/album?q=" + album.artist + " " + album.albumtitle, function(data) {
				console.log(data);
				if (data.albums.length > 0) {
					album.available = true;
					album.url = "http://open.spotify.com/album/" + data.albums[0].href.split(":")[2];
					$scope.$apply();
				}
				//console.log(data.albums[0].name);
			})			
			
		});
	}
	
}
