"use strict";

$(document).ready(function() {
    let space, dashes, number, clicked, randomNumber; 
    let timeouts = [];
    let turnedOn = false;
    let strictClicked = false;
    let playersTurn = false;
    let playerClicked = false;
    let repeatedClick = false;
    let clickedWrong = false;
    let winner = false;
    let nr = 1;
    let delay = 0;
    let randomNumberArray = [];
    let audio1 = new Audio('sounds/simonSound1.mp3');
    let audio2 = new Audio('sounds/simonSound2.mp3');
    let audio3 = new Audio('sounds/simonSound3.mp3');
    let audio4 = new Audio('sounds/simonSound4.mp3');
    let wrongSound = new Audio('sounds/wrong.mp3');

    // Turn on/off button
    $(".on-off").click(turnOnOff);

    // Start button
    $(".start").click(start);

    // Strict button
    $(".strict").click(strict);
    

    // FUNCTIONS

    // Turns game on/off
    function turnOnOff() {
        clearTimeouts();
        timeouts = [];
        // If game is turned off, turns it on
        if (!turnedOn) {
            // Show appropriate blue button
            $(".off").css("visibility", "hidden");
            $(".on").css("visibility", "visible");
            //Two dashes appear
            $(".display").css("font-size", "40px");
            $(".display").text("- -");
            turnedOn = true;
        // If game is turned on, turns it off
        } else {
            // Show appropriate blue button
            $(".off").css("visibility", "visible");
            $(".on").css("visibility", "hidden");
            // Dashes disappear and number appears
            dashesDissapear();
            turnedOn = false;
            winner = false;
            repeatedClick = false;
            // Strict button's light turns off
            $(".alert").css("background-color", "rgb(0,0,0)");  
            strictClicked = false;
            // Number resets
            nr = 1;
            number = "0" + nr;
        }
    }

    //Initial view
    function dashesDissapear() {
        // Dashes disappear
        clearInterval(space);
        clearInterval(dashes);
     
        $(".display").text("");
        $(".display").css("align-items", "flex-end");

        // Initial colors of quarters
        $(".up__left").css("background-color", "rgba(0, 128, 0, 0.7)");
        $(".up__right").css("background-color", "rgba(255, 0, 0, 0.7)");
        $(".bottom__left").css("background-color", "rgba(255, 255, 0, 0.7)");
        $(".bottom__right").css("background-color", "rgba(0, 35, 150, 0.7)");
        //Turns off sound
        // audio1.pause();
        // audio2.pause();
        // audio3.pause();
        // audio4.pause();
    }
    
    // Starts game
    function start() {
        clearTimeouts();
        timeouts = [];
        repeatedClick = false;
        
        $(".display").css("align-items", "center");        
        if (strictClicked && clickedWrong || !strictClicked && !clickedWrong || strictClicked && !clickedWrong) {
            randomNumberArray = [];
            // Number resets
            nr = 1;
            number = "0" + nr;
        }
        let count = 0;
        dashesDissapear();
        if (turnedOn) {
            space = setInterval(function() {
                if (count !== 3) {
                    $(".display").text("");
                } else {
                    clearInterval(space);
                }
            }, 300);
            
            dashes = setInterval(function() {
                if (count !== 2) {
                    if (!winner) {
                        $(".display").text("- -");
                        $(".display").css("font-size", "40px");                                                                                                                                       
                    } else {
                        $(".display").text("win");   
                        $(".display").css("align-items", "end");   
                        $(".display").css("font-size", "35px");                                                                                                               
                    }
                } else {
                    clearInterval(dashes);
                    if (!winner) {
                        $(".display").css("align-items", "center");
                        $(".display").css("font-size", "40px");                                                                                                                                       
                        computer();
                    } else {
                        $(".display").text("win");                                                   
                        $(".display").css("align-items", "end");
                        $(".display").css("font-size", "35px");                                                                                                                                       
                        winner = false;         
                    }
                }
                count++;
            }, 600);
        }
    }

    // Clicked strict button
    function strict() {
        if (turnedOn) {
            // Light turns on/off
            if (!strictClicked) {
                $(".alert").css("background-color", "rgb(255,0,0)");
                strictClicked = true;
            } else {
                $(".alert").css("background-color", "rgb(0,0,0)");   
                strictClicked = false;         
            }
        }
    }

    // Computer's turn
    function computer() {
        playerClicked = false;
        let delay = 1;
        number = "0" + nr;
        let twoDigits = number.slice(-2);
        $(".display").text(twoDigits);
        
        // If player still doesn't reach 20 correct clicks in a row
        if (number !== "021") {
            
            // If player's clicks are correct
            if (repeatedClick) {
                // Computer repeats all quarters
                for (let i = 0; i < randomNumberArray.length; i++) {
                    delay++;
                    let repeatingQuartersTimeout = setTimeout(function() {
                        lightAndSound(randomNumberArray[i] === 0, randomNumberArray[i] === 1, randomNumberArray[i] === 2, randomNumberArray[i] === 3);
                    }, delay * 800);
                    timeouts.push(repeatingQuartersTimeout);                     
                }
            
                // Plus computer clicks one new quarter
                function playRandomQuarter() { 
                    return new Promise(function (resolve, reject) { 
                        let randomQuarterTimeout = setTimeout(function () { 
                            resolve(randomQuarter());            
                        }, (delay + 1) * 800);
                        timeouts.push(randomQuarterTimeout);                     
                    });
                }
                
                function playerTurn() { 
                    return new Promise(function (resolve, reject) { 
                        resolve(player());
                    });
                }
                
                // Waits after all quarters are clicked, then player can choose where to click
                playRandomQuarter().then(function (result) {
                    return playerTurn();
                });
                
            } else {
                if (strictClicked && clickedWrong || !strictClicked && !clickedWrong || strictClicked && !clickedWrong) {
                    clickedWrong = false;
                    randomQuarter();               
                    player();
                } else {
                    clearTimeouts();
                    clickedWrong = false;
                    delay = 1;
                    
                    let firstRepeatTimeout = setTimeout(function() {
                        lightAndSound(randomNumberArray[0] === 0, randomNumberArray[0] === 1, randomNumberArray[0] === 2, randomNumberArray[0] === 3);                    
                    }, 500);
                    timeouts.push(firstRepeatTimeout);                                         
                    
                    // Computer repeats all quarters
                    for (let i = 1; i < randomNumberArray.length; i++) {
                        delay++;
                        let repeatingQuartersTimeout = setTimeout(function() {
                            lightAndSound(randomNumberArray[i] === 0, randomNumberArray[i] === 1, randomNumberArray[i] === 2, randomNumberArray[i] === 3);
                        }, delay * 800);
                        timeouts.push(repeatingQuartersTimeout);                                         
                    }
                    
                    // Player's turn
                    let playersTurnTimeout = setTimeout(function() {
                        player();
                    }, (delay + 1) * 800);                  
                }
            }
            nr++;   
        
        // If player reaches 20 correct click in a row, he wins
        } else {
            winner = true;
            playerClicked = true;
            start();
        }
    }

    // Player's turn
    function player() {
        playersTurn = true;
        // Player can hover on quarters
        changeCursor();
        
        let newRandomNumberArray = randomNumberArray.slice();
        // Recognizes which quarter was clicked
        $(".up__left, .up__right, .bottom__left, .bottom__right").off('click').click(function(event){
            event.stopPropagation();
            if (!playerClicked) {
                clicked = event.target.className;
                
                for (let i = 0; i < newRandomNumberArray.length; i++) {
                    if (newRandomNumberArray[i] === 0 && clicked === "up__left" ||
                        newRandomNumberArray[i] === 1 && clicked === "up__right" ||
                        newRandomNumberArray[i] === 2 && clicked === "bottom__left" ||
                        newRandomNumberArray[i] === 3 && clicked === "bottom__right") {
                
                        lightAndSound(clicked === "up__left", clicked === "up__right", clicked === "bottom__left", clicked === "bottom__right");
                        newRandomNumberArray.shift();
                        
                        if (newRandomNumberArray.length === 0) {
                            playerClicked = true;
                            repeatedClick = true;
                            let computersTurnTimeout = setTimeout(function() {
                                playersTurn = false;
                                // Player can't hover on quarters
                                changeCursor();
                                computer();
                            }, 500);
                            timeouts.push(computersTurnTimeout);         
                            
                        }
                    } else {
                        playerClicked = true;
                        repeatedClick = false;
                        clickedWrong = true;
                        
                        lightAndSound(clicked === "up__left", clicked === "up__right", clicked === "bottom__left", clicked === "bottom__right");      
                        wrongSound.play();  
                        
                        let redirectToStartTimeout = setTimeout(function() {
                            playersTurn = false;
                            // Player can't hover on quarters
                            changeCursor();
                            nr--;
                            start();
                        }, 500);
                        timeouts.push(redirectToStartTimeout);                                 
                    }
                    break;
                }
            } 
        });
    }
    
    // Random quarter with light and sound
    function randomQuarter() {
        randomNumber = Math.floor(Math.random() * 4);
        randomNumberArray.push(randomNumber);
        lightAndSound(randomNumber === 0, randomNumber === 1, randomNumber === 2, randomNumber === 3);
    }
    
    // Turns light and sound on
    function lightAndSound(condition1, condition2, condition3, condition4) {     
        if (condition1) {
            $(".up__left").css("background-color", "rgb(0, 186, 0)");
            if (!clickedWrong) {
                audio1.play();
            }
            let leftUpTimeout = setTimeout(function() {
                $(".up__left").css("background-color", "rgba(0, 128, 0, 0.7)");
            }, 500);
        } else if (condition2) {
            $(".up__right").css("background-color", "rgb(255, 0, 0)");
            if (!clickedWrong) {
                audio2.play();
            }
            let rightUpTimeout = setTimeout(function() {
                $(".up__right").css("background-color", "rgba(255, 0, 0, 0.7)");
            }, 500);            
        } else if (condition3) {
            $(".bottom__left").css("background-color", "rgb(255, 255, 0)");
            if (!clickedWrong) {
                audio3.play();
            }
            let leftBottomTimeout = setTimeout(function() {
                $(".bottom__left").css("background-color", "rgba(255, 255, 0, 0.7)");
            }, 500);           
        } else if (condition4) {
            $(".bottom__right").css("background-color", "rgb(40, 87, 239)");
            if (!clickedWrong) {
                audio4.play();
            }
            let rightBottomTimeout = setTimeout(function() {
                $(".bottom__right").css("background-color", "rgba(0, 35, 150, 0.7)");
            }, 500);            
        }
    }

    // Player's ability to hover on quarters    
    function changeCursor() {
        let names = [".up__left", ".up__right", ".bottom__left", ".bottom__right"];
        for (let i = 0; i < names.length; i++) {
            if (playersTurn) {
                $(names[i]).css("cursor", "pointer");
            } else {
                $(names[i]).css("cursor", "default");                                
            }
        }
    }

    // Clears all Timeouts
    function clearTimeouts() {
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
    }
});


