class Players {
    constructor () {
        this.players = [];
    }
    addPlayer(hostId, playerId, socketId, name, photo, gameData){
        let player = {hostId, playerId, socketId, name, photo, gameData};
        this.players.push(player);
        return player;
    }
    removePlayer(playerId){
        let player = this.getPlayer(playerId);
        
        if(player){
            this.players = this.players.filter((player) => player.playerId !== playerId);
        }
        return player;
    }
    getPlayer(playerId){
        return this.players.filter((player) => player.playerId === playerId)[0]
    }
    getPlayers(hostId){
        return this.players.filter((player) => player.hostId === hostId);
    }
}

module.exports = {Players};