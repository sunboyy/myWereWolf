var Player = require('./player');
class GameManager {
    constructor() {
        this.players = [];
        this.isStarted = false;
        this.round = 0;
    }
    reset() {
        this.isStarted = false;
        this.players = [];
        this.round = 0;
        Player.count = 0;
    }
    start() {
        this.isStarted = true;
        this.round++;
        this.randomChar();
        this.applyData();
    }
    randomChar() {
        let allCharName = ['moderator', 'were wolf', 'bodyguard', 'villager', 'villager', 'villager', 'were wolf', 'sear', 'villager', 'hunter', 'villager', 'villager'];
        let charactor = allCharName.slice(0, this.players.length);
        for (let i = 0; i < this.players.length; i++) {
            let thisCharIndex = Math.floor(Math.random() * charactor.length);
            this.players[i].role = charactor[thisCharIndex];
            charactor.splice(thisCharIndex, 1);
        }
    }
    applyData() {
        for (let i = 0; i < this.players.length; i++) {
            let data = [];
            if (this.players[i].role == "moderator") {
                let nonModulator = this.players.filter(function (item) { return item.role != "moderator"; });
                data = nonModulator.map(function (item) { return { name: item.name, char: item.role } });
            }
            else if (this.players[i].role == "were wolf") {
                let thisPlayer = this.players[i];
                let werewolves = this.players.filter(function (player) { return thisPlayer != player && player.role == "were wolf" });
                data = werewolves.map(function (item) { return { name: item.name, char: item.role } });
            }
            this.players[i].data = data;
        }
    }
    restart() {
        this.isStarted = false;
        this.players.forEach(function (player) {
            player.restart();
        });
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
                if (player.isHost) {
                    player.time -= 1.67;
                }
            });
        }
    }
}
module.exports = GameManager;
