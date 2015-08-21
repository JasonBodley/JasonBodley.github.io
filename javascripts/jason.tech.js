$(function() {

    var hour = new Date().getHours();

    var nightMode = localStorage.getItem("night-mode");
    var mainContent = localStorage.getItem("main-content");
    var fontSize = localStorage.getItem("");

    if (nightMode) {
        if (nightMode === "true") {
            $("#image").trigger("click");
        }
    } else if (hour >= 21 || hour < 6) {
        $("#image").trigger("click");
    }

    if (!mainContent) {
        var mainContent = localStorage.setItem("main-content", "home");
        mainContent = "home";
    }

    $('#MainContent').load(mainContent + '.html', function() {
        $(".fade-in").hide().fadeIn("slow", function() {
            $('#' + mainContent).addClass("active");
            if (fontSize) {
                $("p,a").css("font-size", size);
            }
        });
    });



});

$("#image").click(function() {
    var x = $("html");
    if (x.hasClass("invert")) {
        localStorage.setItem("night-mode", false);
        x.removeClass("invert").addClass("no-invert");
        $(this).removeClass("invert").addClass("no-invert");
        $(".invert-only").stop().fadeOut();
    } else {
        $(".invert-only").stop().fadeIn();
        x.removeClass("no-invert").addClass("invert");
        $(this).removeClass("no-invert").addClass("invert");
        $(".no-invert").removeClass("no-invert").addClass("no-invert");
        localStorage.setItem("night-mode", true);
    }
});

$(".btn-link").hover(function(e) {

    var link = $(this).find("a");
    var backgroundColor = link.css("color");
    var foregroundColor = $("body").css("background-color");
    $(this).css({
        "background-color": backgroundColor,
        "border-radius": "8px"
    });
    link.css({
        "color": foregroundColor
    });

}, function(e) {

    var link = $(this).find("a");
    var backgroundColor = link.css("color");
    var foregroundColor = $(this).css("background-color");
    $(this).css({
        "background-color": backgroundColor,
        "border-radius": "8px"
    });
    link.css({
        "color": foregroundColor
    });

});

$(".font-change").click(function() {
    var size = $(this).attr("size");
    $("p,a").css("font-size", size);
    localStorage.setItem("font-size", size);
});

$(".page-changer").click(function() {
    $(".page-changer").removeClass("active");
    $(this).addClass("active");
    var id = $(this).attr("id");

    var $mainContent = $('#MainContent');

    $mainContent.find(".fade-in").fadeOut(function() {
        $mainContent.empty();
        $mainContent.load(id + '.html', function() {
            localStorage.setItem("main-content", id);
            var fontSize = localStorage.getItem("font-size");
            if (fontSize) {
                $mainContent.find("p,a").css("font-size", localStorage.getItem("font-size"));
            }
            $mainContent.show();
            $mainContent.find(".fade-in").hide().fadeIn(function() {});
        });
    });

});