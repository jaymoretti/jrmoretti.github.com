$(function() {

  // init the FB JS SDK
  FB.init({
    appId: '713147355367589', // App ID from the app dashboard
    status: true, // Check Facebook Login status
    xfbml: true // Look for social plugins on the page
  });


  var escrotos = ["104013416300586", "105821366170914", "106050456092040", "108406652517795", "112443095489493", "132292223601262", "145458632171108", "145748592174541", "148852884571", "151120678280533", "153747311350289", "154956594563667", "156822787674291", "162731380454099", "164188247072662", "168003059912404", "171106109659288", "172911526160944", "175020319210328", "180462727200", "185875761943", "189649431047655", "190928727653011", "202767609743349", "210423442368392", "242300655902942", "348894685159580", "63458407365", "80711932254"];
  var friends = [];
  var me = {};
  var token;
  var count = 0;
  var generalLikes = 0;
  var generalBadLikes = 0;

  $("#start-btn").on("click", function(evt) {
    $("#start-btn").remove();

    FB.getLoginStatus(function(response) {
      if (response.authResponse) {
        getMe();
        getFriends();
      } else {
        FB.login(function(response) {
          if (response.authResponse) {
            getMe();
            getFriends();
          }
        }, {
          scope: 'user_likes, friends_likes'
        });
      }
    });
  });


  function getMe () {
    FB.api("/me", function(response) {
      me.name = response.name;
    });
  }

  function getFriends() {
    FB.api("/me/friends", {
      limit: 99999
    }, function(losAmigos) {

      count = 0;
      friends = losAmigos.data;
      me.totalFriends = friends.length;

      for (var i = 0; i < friends.length; i++) {
        // getLikes(friends[i]);
        getLikes.apply(this, [friends[i]]);
      };

    });

    FB.api("/me/likes", {
      limit: 99999,
      fields: 'id'
    }, function(response) {
      me.likes = _.pluck(response.data, 'id');
      me.badLikes = _.intersection(escrotos, me.likes).length;
      me.totalLikes = me.likes.length;
      me.grade = 100 * me.badLikes / me.totalLikes;
    });
  }


  function getLikes(friend) {

    var calc = calculate;
    FB.api(friend.id + "/likes", {
      fields: 'id',
      limit: 99999
    }, function(response) {
      friend.likes = _.pluck(response.data, 'id');
      if (friend.likes.length > 0) {

        friend.badLikes = _.intersection(escrotos, friend.likes).length;
        friend.totalLikes = friend.likes.length;
        friend.grade = 100 * friend.badLikes / friend.totalLikes;
        generalLikes += friend.totalLikes;
        generalBadLikes += friend.badLikes;

      } else {
        friend.badLikes = 0;
        friend.totalLikes = 0;
        friend.grade = 0;
      }


      count++;
      if (count >= friends.length) {
        // me.grade = me.grade + ((100 * generalBadLikes / generalLikes) / 2);
        calc.call(null);
      }
    });

  }

  function calculate() {
    //console.log(_.sortBy(friends, 'badLikes'));
    //console.log(me)


    var _friends = _.sortBy(friends, 'grade').reverse();

    _.templateSettings.variable = "friends";

    var _sayWaaaaa = me;

    console.log(_sayWaaaaa)

    // // Grab the HTML out of our template tag and pre-compile it.
    var template = _.template(
      $("script.template").html()
    );

    var templateYou = _.template(
      $("script.templateYou").html()
    );

    $("body").html(templateYou(_sayWaaaaa));
    $("body").append(template(_friends));

  }

});