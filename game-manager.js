class GameManager {
    constructor() {
        this.players = [];
        this.isStarted = false;
        this.playerID = 0;
        this.round = 0;
    }
    reset() {
        this.isStarted = false;
        this.players = [];
        this.playerID = 0;
        this.round = 0;
    }
    start() {
        this.isStarted = true;
        this.round++;
    }
    restart() {
        this.isStarted = false;
    }
    gameLoop() {
        if (!this.isStarted) {
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
        else {
            this.players.forEach(function (player) {
                if (player.host) {
                    player.time -= 1.67;
                }
            });
        }
    }
}
module.exports = GameManager;
