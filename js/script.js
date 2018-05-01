"use strict";

$(document).ready(function() {
    let space, dashes, number, clicked, randomNumber, quarter;
    let turnedOn = false;
    let playerClicked = false;
    let nr = 1;
    let audio1 = new Audio('sounds/simonSound1.mp3');
    let audio2 = new Audio('sounds/simonSound2.mp3');
    let audio3 = new Audio('sounds/simonSound3.mp3');
    let audio4 = new Audio('sounds/simonSound4.mp3');

    // Turn on/off button
    $(".on-off").click(turnOnOff);

    // Start button
    $(".start").click(start);
    

    // FUNCTIONS

    // Turns game on/off
    function turnOnOff() {
        // If game is turned off, turn it on
        if (!turnedOn) {
            // Show appropriate blue button
            $(".off").css("visibility", "hidden");
            $(".on").css("visibility", "visible");
            //Two dashes appear
            $(".display").css("font-size", "40px");
            $(".display").text("- -");
            turnedOn = true;
        // If game is turned on, turn it off
        } else {
            // Show appropriate blue button
            $(".off").css("visibility", "visible");
            $(".on").css("visibility", "hidden");
            // Dashes disappear and number appears
            dashesDissapear();
            turnedOn = false;
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
        // Number appears
        clearTimeout(number);
        $(".display").text("");
        $(".display").css("align-items", "flex-end");

        // Initial colors of quarters
        $(".up__left").css("background-color", "rgba(0, 128, 0, 0.7)");
        $(".up__right").css("background-color", "rgba(255, 0, 0, 0.7)");
        $(".bottom__left").css("background-color", "rgba(255, 255, 0, 0.7)");
        $(".bottom__right").css("background-color", "rgba(0, 35, 150, 0.7)");
        //Turns off sound
        audio1.pause();
        audio2.pause();
        audio3.pause();
        audio4.pause();
    }
    
    // Starts game
    function start() {
        dashesDissapear();
        let count = 0;
        // Number resets
        nr = 1;
        number = "0" + nr;
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
                    $(".display").text("- -");
                } else {
                    clearInterval(dashes);
                    $(".display").css("align-items", "center");
                    computer();
                }
                count++;
            }, 600);
        }
    }

    function computer() {
        playerClicked = false;
        number = "0" + nr;
        let twoDigits = number.slice(-2);
        $(".display").text(twoDigits);
        randomQuarter();
        console.log(randomNumber);
        nr++;
        player();
    }

    function player() {
        // Player can hover on quarters
        let names = [".up__left", ".up__right", ".bottom__left", ".bottom__right"];
        for (let i = 0; i < names.length; i++) {
            $(names[i]).hover(function() {
                $(this).css("cursor", "pointer");
            });
        }
        // Recognizes which quarter was clicked
        $(".up__left, .up__right, .bottom__left, .bottom__right").click(function(event){
            if (!playerClicked) {
                clicked = event.target.className;
                console.log(event.target.className);
                lightAndSound(clicked === "up__left", clicked === "up__right", clicked === "bottom__left", clicked === "bottom__right");
                if (randomNumber === 0 && clicked === "up__left" ||
                    randomNumber === 1 && clicked === "up__right" ||
                    randomNumber === 2 && clicked === "bottom__left" ||
                    randomNumber === 3 && clicked === "bottom__right") {
                        console.log("Paspaudei ta pati!");
                        playerClicked = true;
                        setTimeout(function() {
                            computer();
                        }, 2000)
                }
            }
        });
    }
    
    // Random quarter with light and sound
    function randomQuarter() {
        randomNumber = Math.floor(Math.random() * 4);
        lightAndSound(randomNumber === 0, randomNumber === 1, randomNumber === 2, randomNumber === 3);
    }
    
    // Turns light and sound on
    function lightAndSound(condition1, condition2, condition3, condition4) {
        if (condition1) {
            $(".up__left").css("background-color", "rgb(0, 186, 0)");
            audio1.play();
            setTimeout(function() {
                $(".up__left").css("background-color", "rgba(0, 128, 0, 0.7)");
            }, 500);
        } else if (condition2) {
            $(".up__right").css("background-color", "rgb(255, 0, 0)");
            audio2.play();
            setTimeout(function() {
                $(".up__right").css("background-color", "rgba(255, 0, 0, 0.7)");
            }, 500);
            quarter = "rightUp";            
        } else if (condition3) {
            $(".bottom__left").css("background-color", "rgb(255, 255, 0)");
            audio3.play();
            setTimeout(function() {
                $(".bottom__left").css("background-color", "rgba(255, 255, 0, 0.7)");
            }, 500);
            quarter = "leftBottom";            
        } else if (condition4) {
            $(".bottom__right").css("background-color", "rgb(40, 87, 239)");
            audio4.play();
            setTimeout(function() {
                $(".bottom__right").css("background-color", "rgba(0, 35, 150, 0.7)");
            }, 500);
            quarter = "rightBottom";            
        }
    }

});

