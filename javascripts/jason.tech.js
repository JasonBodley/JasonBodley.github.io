$(function() {
		$("header a").attr("target","_blank");

    var hour = new Date().getHours();

    var mainContent = localStorage.getItem("main-content");

    if (!mainContent) {
        var mainContent = localStorage.setItem("main-content", "home");
        mainContent = "home";
    }

    $('#MainContent').load(mainContent + '.html', function() {
        $(".fade-in").hide().fadeIn("slow", function() {
            $('#' + mainContent).addClass("active");
        });
    });
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
            $mainContent.show();
            $mainContent.find(".fade-in").hide().fadeIn(function() {});
        });
    });
});