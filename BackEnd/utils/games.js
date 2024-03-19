class Games {
    constructor () {
        this.games = [];
    }
    addGame(pin, hostId, gameLive, gameData){
        let game = {pin, hostId, gameLive, gameData};
        this.games.push(game);
        return game;
    }
    removeGame(hostId){
        let game = this.getGameByPin(hostId);
        
        if(game){
            this.games = this.games.filter((game) => game.hostId !== hostId);
        }
        return game;
    }

    // getGame(hostId){
    //     return this.games.filter((game) => game.hostId === hostId)[0]
    // }

    getGameByPin(pin){
        return this.games.filter((game) => game.pin === pin)[0]
    }
}

module.exports = {Games};