
// $(function () {
    $("#playTime").on("click", event => {
        event.preventDefault();
        $.get("/api/character",
            data => {
                $("#totalPlayTime").text(data.totalPlayTime)
            });
    });

    $("#apiItems").on("click", event => {
        event.preventDefault();
        $.get("/api/items",
            data => {
                $("#firstItem").text(data.firstItem)
            });
    });
// });