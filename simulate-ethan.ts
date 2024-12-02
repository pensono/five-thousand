const bonuses = {
    1: 1000,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    6: 600
}
function scoreDice(dice) {
    let score = 0;
    const counts = dice.reduce((acc, d) => ({...acc, [d]: 1 + (acc[d] ?? 0)}), {})
    
    for (const [i, count] of Object.entries(counts)) {
        if (count >= 3) {
            score += bonuses[i]
            counts[i] -= 3
        }
    }
    score += (counts[1] ?? 0) * 100;
    score += (counts[5] ?? 0) * 50;

    const uncounted = Object.values(counts).reduce((acc, c) => c + acc, 0) - (counts[1] ?? 0) - (counts[5] ?? 0)

    return {score, uncounted};
}

function simulateTurn(shouldContinue) {
    let score = 0;
    let numberToRoll = 5
    do {
        const dice = Array(numberToRoll).fill(0).map(() => Math.floor(1 + Math.random() * 6));
        const {score: newScore, uncounted } = scoreDice(dice);
        // console.log(score, dice, newScore)

        if (newScore === 0) {
            // Nada!
            return 0;
        }
        numberToRoll = uncounted === 0 ? 5 : uncounted;
        score += newScore;

    } while(shouldContinue({numberToRoll, score}));
    return score;
}

function range(start, stop, step) {
    const values = []
    for (let i = start; i <= stop; i += step) {
        values.push(i)
    }
    return values;
}

const STRATEGIES = {
    'Stop on one': ({numberToRoll, score}) => {
        return numberToRoll > 1;
    },
    'Stop on two': ({numberToRoll, score}) => {
        return numberToRoll > 2;
    },
    'Stop on three': ({numberToRoll, score}) => {
        return numberToRoll > 3;
    },
    'NAK ATTK': ({numberToRoll, score}) => {
        return !((numberToRoll <= 2) || (score >= 500));
    },
    // 'Ethan strat': ({numberToRoll, score}) => {
    //     const stopValues = {
    //         1: 250,
    //         2: 500,
    //         3: 700,
    //         4: 1000,
    //         5: 1500,
    //     }
    //     return score < stopValues[numberToRoll];
    // },
    ...Object.fromEntries(range(0, 1000, 50).map(i => 
        [`${i} floor`, ({numberToRoll, score}) => {
            return score <= i && numberToRoll >= 2;
        }]
    ))
}

const stats = []
let simulations = 100_000;
for (const [name, fn] of Object.entries(STRATEGIES)) {
    let total = 0;
    for (let i = 0; i < simulations; i++) {
        const s = simulateTurn(fn)
        total += s
    }

    stats.push({
        strategy: name,
        average: total / simulations,
        simulations,
    })
}

console.table(stats)