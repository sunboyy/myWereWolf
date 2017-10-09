class GameManager {
    constructor() {
        this.players = [];
        this.playerID = 0;
        this.state = "waiting";
        this.round = 0;
    }
    reset() {
        this.state = "waiting";
        this.players = [];
        this.playerID = 0;
        this.round = 0;
    }
    start() {
        this.state = "start";
        this.round++;
    }
    restart() {
        this.state = "waiting";
    }
    gameLoop() {
        if (this.state == "waiting") {
            this.players.forEach(function (player) {
                player.time -= 1000;
            });
            // players = players.filter(function(item){
            //     return item.time > 0;
            // });
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].time <= 0) {
                    this.players.splice(i, 1);
                }
            }
        }
        else if (this.state == "start") {
            this.players.forEach(function (player) {
                if (player.host) {
                    player.time -= 1.67;
                }
            });
        }
    }
}
module.exports = GameManager;
