$(function() {

		$("header a").attr("target","_blank");

    var hour = new Date().getHours();

    var mainContent = localStorage.getItem("main-content");
    var fontSize = localStorage.getItem("");

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

$(".font-change").click(function() {
    var size = $(this).attr("data-size");
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