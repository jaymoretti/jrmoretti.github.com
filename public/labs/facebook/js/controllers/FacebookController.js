define(["models/FacebookUserModel"], function(){
	var model = require('models/FacebookUserModel');
	// force loading the damn facebook script.
	require(["//connect.facebook.net/en_US/all.js"],function(){});

	window.fbAsyncInit = function(){
		FB.init({
			appId: '519871584769671', // App ID from the app dashboard
			status: true, // Check Facebook Login status
			xfbml: true // Look for social plugins on the page
		});

		FB.getLoginStatus(function(response) {
			if (response.authResponse) {
				getMe();
				getFamily();
				getFriends();
			} else {
				FB.login(function(response) {
					if (response.authResponse) {
						getMe();
						getFriends();
					} else {
						throw "You must accept the app before continuing";
					}
				}, {
					scope: 'user_actions.books, user_actions.video, user_actions.music, user_actions.news, user_likes, user_interests, user_photos, user_relationships, user_work_history, user_education_history, user_events, friends_likes, friends_hometown, friends_relationship_details,'
				});
			}
		});
	}

	function getMe(){
		console.log("REQUESTING USER DATA");
		FB.api('/me', function(data, err){
			if(!err){
				//model.inject("user", data);
			}
		});
	}

	function getFriends(){
		console.log("REQUESTING FRIENDS DATA");
		FB.api('/me/friends', function(data, err){
			if(!err){
				console.log(data);
				//model.inject("friends", data);
			}
		});
	}

	function getFamily(){
		console.log("REQUESTING FAMILY DATA");
		FB.api('/me/familylash', function(data, err){
			if(!err){
				console.log(data);
				//model.inject("friends", data);
			}
		});
	}
});