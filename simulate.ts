let dice = []
while (true) {
    for (let i = 0; i<5; i++){
        dice[i] = Math.floor((Math.random() *6+1))
    }

    let score = 0
    
    let countOf1s=0
    let countOf2s=0
    let countOf3s=0
    let countOf4s=0
    let countOf5s=0
    let countOf6s=0
    
    // Count dice
    for (let i=0;i<5;i++){
        if (dice[i]===1){
            countOf1s++
        }
        if (dice[i]===5){
            countOf5s++
        }
    }

    // Score dice
    if (countOf1s>=3){
        score+=1000
        countOf1s -= 3
    }
    score += countOf1s * 100
    if (countOf5s>=3){
        score+=500
        countOf5s -= 3
    }
    if (countOf2s>=3){
        score+=200
    }
    if (countOf3s>=3){
        score+=300
    }
    if (countOf4s>=3){
        score+=400
    }
    if (countOf6s>=3){
        score+=600
    }
    
    score += countOf5s * 50

    console.log(dice,score)

}