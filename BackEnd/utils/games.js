class Games {
    constructor () {
        this.games = [];
    }
    addGame(pin, hostId, gameLive, remoteMode, timeLimit, gameData){
        let game = {pin, hostId, gameLive, remoteMode, timeLimit, gameData};
        this.games.push(game);
        return game;
    }
    removeGame(pin){
        let game = this.getGameByPin(pin);
        
        if(game){
            this.games = this.games.filter((game) => game.pin !== pin);
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