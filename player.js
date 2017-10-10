class Player {
    constructor(name, isHost) {
        this.name = name;
        this.id = Player.count;
        this.isHost = isHost;
        this.role = null;
        this.data = [];
        this.time = 30000;
        Player.count++;
    }
    restart() {
        this.role = null;
        this.data = [];
    }
    refresh() {
        this.time = 30000;
    }
}
Player.count = 0;
module.exports = Player;
