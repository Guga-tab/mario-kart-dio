const player1 = {
    NAME: "Mario",
    VELOCIDADE: 3,
    MANOBRABILIDADE: 4,
    POWER: 4,
    POINTS: 0,
    ROUND_POINTS: 0,
    POWER_MATCH: 0
};

const player2 = {
    NAME: "Luigi",
    VELOCIDADE: 4,
    MANOBRABILIDADE: 4,
    POWER: 3,
    POINTS: 0,
    ROUND_POINTS: 0,
    POWER_MATCH: 0
};

async function rollDice(){
    return Math.floor(Math.random() * 6) + 1;
}

async function rollWeapon(){
    return Math.floor(Math.random() * 2) + 1;
}

async function getRandomBlock() {
    let random = Math.random();
    let result;

    switch(true){
        case random < 0.33:
            result = "RETA"
            break;
        case random < 0.66:
            result = "CURVA"
            break;
        case random < 0.99:
            result = "CONFRONTO"
            break;
    }

    return result;
}

async function logRollResult(characterName, block, diceResult, attribute) {
    console.log(`${characterName} 🎲 rolou um dado de ${block} ${diceResult} + ${attribute} = ${diceResult + attribute}`);
}

async function showResults(character1, character2) {
    console.log(`${character1.NAME} possui: ${character1.POINTS}`);
    console.log(`${character2.NAME} possui: ${character2.POINTS}`);
}

async function scorePoint(character1, character2) {
    if (character1.ROUND_POINTS > character2.ROUND_POINTS){
        console.log(`${character1.NAME} marcou um ponto!\n`);
        character1.POINTS++;
    } else if (character2.ROUND_POINTS > character1.ROUND_POINTS){
        console.log(`${character2.NAME} marcou um ponto!\n`);
        character2.POINTS++;
    } else {
         console.log("Empate!\n");
    }
}

async function clashMatch(character1, character2) {
    let numWeapon = await rollWeapon();

    if(character1.POWER_MATCH > character2.POWER_MATCH && character2.POINTS > 0){
        console.log(numWeapon == 1 
            ? `${character1.NAME} lançou um casco... \n${character1.NAME} venceu o confronto! \n${character2.NAME} perdeu ${numWeapon} ponto 🐢 \n${character1.NAME} ganhou um turbo(+1 ponto)!`
            : `${character1.NAME} lançou uma bomba... \n${character1.NAME} venceu o confronto! \n${character2.NAME} perdeu ${numWeapon} ponto 💣 \n${character1.NAME} ganhou um turbo(+1 ponto)!`
        );

        character2.POINTS - numWeapon > 0 ? character2.POINTS -= numWeapon : character2.POINTS = 0;
        character1.POINTS++;

    }else if(character1.POWER_MATCH > character2.POWER_MATCH && character2.POINTS <= 0){
        console.log(`${character1.NAME} venceu o confronto! ${character2.NAME} não perdeu ponto`)
    }

    if(character2.POWER_MATCH > character1.POWER_MATCH && character1.POINTS > 0){
        console.log(numWeapon == 1 
            ? `${character2.NAME} lançou um casco... \n${character2.NAME} venceu o confronto! \n${character1.NAME} perdeu ${numWeapon} ponto 🐢 \n${character2.NAME} ganhou um turbo(+1 ponto)!`
            : `${character2.NAME} lançou um bomba... \n${character2.NAME} venceu o confronto! \n${character1.NAME} perdeu ${numWeapon} ponto 💣 \n${character2.NAME} ganhou um turbo(+1 ponto)!`
        );

        character1.POINTS - numWeapon > 0 ? character1.POINTS -= numWeapon : character1.POINTS = 0;
        character2.POINTS++;

    }else if(character2.POWER_MATCH > character1.POWER_MATCH && character1.POINTS <= 0){
        console.log(`${character2.NAME} venceu o confronto! ${character1.NAME} não perdeu ponto`)
    }

    console.log(character2.POWER_MATCH === character1.POWER_MATCH ? "Confronto empatado! Nenhum ponto foi perdido e nenhum ponto foi ganho" : "");
}

async function playerRaceEngine(character1, character2) {
    for(let round = 1; round <= 5; round++){
        console.log(`🏁 Rodada ${round}`);

        // set block
        let block = await getRandomBlock();
        console.log(`Bloco: ${block}`);

        let diceResult1 = await rollDice();
        let diceResult2 = await rollDice();

        character1.ROUND_POINTS = 0;
        character2.ROUND_POINTS = 0;

        if(block == "RETA"){
            character1.ROUND_POINTS = diceResult1 + character1.VELOCIDADE;
            character2.ROUND_POINTS = diceResult2 + character2.VELOCIDADE;

            await logRollResult(
                character1.NAME, 
                "velocidade", 
                diceResult1, 
                character1.VELOCIDADE
            );

            await logRollResult(
                character2.NAME, 
                "velocidade", 
                diceResult2, 
                character2.VELOCIDADE
            );

            await scorePoint(character1, character2);
        }

        if(block == "CURVA"){
            character1.ROUND_POINTS = diceResult1 + character1.MANOBRABILIDADE;
            character2.ROUND_POINTS = diceResult2 + character2.MANOBRABILIDADE;

            await logRollResult(
                character1.NAME, 
                "manobrabilidade", 
                diceResult1, 
                character1.MANOBRABILIDADE
            );

            await logRollResult(
                character2.NAME, 
                "manobrabilidade", 
                diceResult2, 
                character2.MANOBRABILIDADE
            );

            await scorePoint(character1, character2);
        }

        if(block == "CONFRONTO"){
            character1.POWER_MATCH = diceResult1 + character1.POWER;
            character2.POWER_MATCH = diceResult2 + character2.POWER;

            console.log(`${character1.NAME} confrontou com ${character2.NAME}! 🥊`);

            await logRollResult(
                character1.NAME, 
                "poder", 
                diceResult1, 
                character1.POWER
            );

            await logRollResult(
                character2.NAME, 
                "poder", 
                diceResult2, 
                character2.POWER
            );

            await clashMatch(character1, character2);
        }
        await showResults(character1, character2);

        console.log("\n-------------------------\n");
    }
}

async function declareWinner(character1, character2) {
    console.log("Resultado final:");
    console.log(`${character1.NAME}: ${character1.POINTS} ponto(s)`);
    console.log(`${character2.NAME}: ${character2.POINTS} ponto(s)`);

    if(character1.POINTS > character2.POINTS){
        console.log(`\n${character1.NAME} venceu a corrida! Parabéns! 🏆`);
    }else if(character2.POINTS > character1.POINTS){
        console.log(`\n${character2.NAME} venceu a corrida! Parabéns! 🏆`);
    }else{
        console.log("\nA corrida terminou em empate!");
    }
}

(async function main() {
    console.log(`🏁🚨 Corrida entre ${player1.NAME} e ${player2.NAME} começando...\n`);
    
    await playerRaceEngine(player1, player2);
    await declareWinner(player1, player2);
})()