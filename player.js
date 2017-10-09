class Player {
    constructor(name, id, isHost, role, data, time) {
        this.name = name;
        this.id = id;
        this.isHost = isHost;
        this.role = role;
        this.data = data;
        this.time = 30000;
    }
    restart() {
        this.role = null;
        this.data = null;
    }
    refresh() {
        this.time = 30000;
    }
}
module.exports = Player;
