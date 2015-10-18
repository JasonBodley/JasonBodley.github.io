$(function() {
		$("header a").attr("target","_blank");

    var mainContent = localStorage.getItem("main-content");
    var backgroundImage = localStorage.getItem("background-image");

    if (!mainContent) {
        var mainContent = localStorage.setItem("main-content", "home");
        mainContent = "home";
    }
    
    if (backgroundImage) {
	    $('#' + backgroundImage).trigger("click");
    }

    $('#main-content').load(mainContent + '.html', function() {
        $(".fade-in").hide().fadeIn("slow", function() {
            $('#' + mainContent).addClass("active");
            $('.overlay').hide();
        });
    });
    
});

$(".img-changer").click(function() {
	if ($(this).hasClass("fa-square-o")) {
		$(".img-changer").removeClass("fa-square").addClass("fa-square-o");
		$(this).addClass("fa-square");
		var id = $(this).attr("id");
		$("body").removeClass();
		$("body").addClass("background-" + id);
		localStorage.setItem("background-image", id);
	}
});

$(".page-changer").click(function() {

		var $mainContent = $('#main-content');
		var $spinner = $("#nonObtrusiveSpinner");
		
		$spinner.show();
    
    $(".page-changer").removeClass("active");
    $(this).addClass("active");
    var id = $(this).attr("id");

    $mainContent.find(".fade-in").fadeOut(function() {
        $mainContent.empty();
        
        $mainContent.load(id + '.html', function(x) {
            localStorage.setItem("main-content", id);
            $mainContent.show();
            $mainContent.find(".fade-in").hide().fadeIn(function() {});
            $spinner.hide();
        });
    });
});