module.exports = function (app, gameManager) {

    app.get('/', function (req, res) {
        if (!gameManager.isStarted) {
            res.render("name", { msg: "" });
        }
        else {
            res.render("name", { msg: "The game was started. Please wait for the next round." });
        }
    });

    app.get('/login', function (req, res) {
        res.render("login", { pwdst: "" });
    });


}