$(function() {

  $('.overlay').show();
  $("header a").attr("target", "_blank");

  var mainContent = localStorage.getItem("main-content");
  var backgroundImage = localStorage.getItem("background-image");

  if (!mainContent) {
    var mainContent = trySetLocalStorage("main-content", "home");
    mainContent = "home";
  }

  if (backgroundImage) {
    $('#' + backgroundImage).trigger("click");
  }

  $('#main-content').load(mainContent + '.html', function() {
  
    $(".fade-in").hide().fadeIn("slow", function() {
      $('#' + mainContent).addClass("active");
      $('.overlay').fadeOut();
      $('.disabled').removeClass("disabled");
    });
    
  });

});

$(".img-changer").click(function() {

  var $changer = $(this);

  if ($changer.hasClass("fa-square-o")) {

    $(".img-changer").removeClass("fa-square").addClass("fa-square-o");
    $(this).addClass("fa-square");
    var id = $(this).attr("id");
    $("body").removeClass();
    $("body").addClass("background-" + id);
    trySetLocalStorage("background-image", id);

  }

});

$(".page-changer").click(function() {

  var $changer = $(this);

  if (!$changer.hasClass("active") && !$changer.hasClass("disabled")) {

    var $mainContent = $('#main-content');
    var $spinner = $("#nonObtrusiveSpinner");

    $spinner.show();

    $(".page-changer").removeClass("active");
    $(".page-changer").addClass("disabled");
    $changer.addClass("active");
    var id = $changer.attr("id");
    
    var finishLoading = function(content) {
    
	    $mainContent.show();
      $mainContent.find(".fade-in").hide().fadeIn(function() {});
      $spinner.hide();
      $(".page-changer").removeClass("disabled");
      
    };

    $mainContent.find(".fade-in").fadeOut(function() {
    
      $mainContent.empty();

      $mainContent.load(id + '.html', function(response, status, xhr) {
        if (status == "success") {
          ("main-content", id);
          finishLoading($mainContent);
        } else {
          $mainContent.load('error.html', function(response, status, xhr) {
            $mainContent.find("#verboseError").html("Couldn't find the page '<em>" + spaceOutText(id) + "</em>' - sorry.");
            finishLoading($mainContent);
          });
        }
        
      });
      
    });

  }
});

function trySetLocalStorage(key, item) {
	try {
		localStorage.setItem("main-content", "home");
	} catch (ex) {
		console.log("An attempt to set LocalStorage for " + key + " was made but was prevented by the brwoser.")	
	}
}

function spaceOutText(text) {
	return text.replace(/([A-Z])/g, ' $1')
		.replace(/^./, function(str){ return str.toUpperCase(); })
}