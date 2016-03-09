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
    
  var $mainContent = $('#main-content');
  $mainContent.append($("<div id='" + mainContent + "' class='page-content'></div>"));
  var $content = $mainContent.find('#' + mainContent);

  $content.load(mainContent + '.html', function() {
  
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
    
      content.find(".fade-in").hide();
      content.show();
      content.find(".fade-in").fadeIn(function() {});
      $spinner.hide();
      $(".page-changer").removeClass("disabled");
      
    };

    $mainContent.find(".page-content").hide();
    
      var $content = $mainContent.find("#" + id);
      if ($content.length > 0) {
          finishLoading($content); 
      } else {
          $mainContent.append($("<div id='" + id + "' class='page-content'></div>"));
          var $content = $mainContent.find('#' + id);
          
          $content.load(id + '.html', function(response, status, xhr) {
            if (status === "success") {
              ("main-content", id);
              finishLoading($content);
            } else {
              $content.load('error.html', function(response, status, xhr) {
                $content.find("#verboseError").html("Couldn't find the page '<em>" + spaceOutText(id) + "</em>' - sorry.");
                finishLoading($content);
              });
            }

          });
      }
      
      trySetLocalStorage("main-content", id);

  }
});

function trySetLocalStorage(key, item) {
	try {
		localStorage.setItem(key, item);
	} catch (ex) {
		console.log("An attempt to set LocalStorage for " + key + " was made but was prevented by the browser.")	
	}
}

function spaceOutText(text) {
	return text.replace(/([A-Z])/g, ' $1')
		.replace(/^./, function(str){ return str.toUpperCase(); })
}