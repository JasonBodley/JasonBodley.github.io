$(function() {
		$("header a").attr("target","_blank");

    var mainContent = localStorage.getItem("main-content");

    if (!mainContent) {
        var mainContent = localStorage.setItem("main-content", "home");
        mainContent = "home";
    }

    $('#main-content').load(mainContent + '.html', function() {
        $(".fade-in").hide().fadeIn("slow", function() {
            $('#' + mainContent).addClass("active");
        });
    });
});

$(".page-changer").click(function() {
    $(".page-changer").removeClass("active");
    $(this).addClass("active");
    var id = $(this).attr("id");

    var $mainContent = $('#main-content');

    $mainContent.find(".fade-in").fadeOut(function() {
        $mainContent.empty();
        $mainContent.load(id + '.html', function() {
            localStorage.setItem("main-content", id);
            $mainContent.show();
            $mainContent.find(".fade-in").hide().fadeIn(function() {});
        });
    });
});