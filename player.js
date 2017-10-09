class Player {
    constructor(name, isHost, role, data, time) {
        this.name = name;
        this.id = Player.count;
        this.isHost = isHost;
        this.role = role;
        this.data = data;
        this.time = 30000;
        Player.count++;
    }
    restart() {
        this.role = null;
        this.data = null;
    }
    refresh() {
        this.time = 30000;
    }
}
Player.count = 0;
module.exports = Player;
