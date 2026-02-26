// ==============================
// KYRO MAIN SCRIPT
// ==============================

document.addEventListener("DOMContentLoaded", () => {

    initLiveStatus();
    initSmoothScroll();
    initNavbarScrollEffect();

});


// ==============================
// 🔹 LIVE STATUS SYSTEM
// ==============================

function initLiveStatus(){

    const statusText = document.getElementById("botStatus");
    const statusDot = document.querySelector(".status-dot");

    if(!statusText || !statusDot) return;

    async function fetchBotStatus(){
        try{
            const response = await fetch("http://localhost:3000/api/status");

            if(!response.ok) throw new Error();

            const data = await response.json();

            statusText.innerText =
                `Online | ${data.servers} Server | ${data.members} Mitglieder`;

            statusDot.style.background = "lime";

        }catch{
            statusText.innerText = "Offline";
            statusDot.style.background = "red";
        }
    }

    fetchBotStatus();
    setInterval(fetchBotStatus, 15000);
}


// ==============================
// 🔹 SMOOTH SCROLL
// ==============================

function initSmoothScroll(){

    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function(e){

            const target = document.querySelector(this.getAttribute("href"));

            if(target){
                e.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth"
                });
            }

        });
    });

}


// ==============================
// 🔹 NAVBAR SCROLL EFFECT
// ==============================

function initNavbarScrollEffect(){

    const navbar = document.querySelector(".navbar");
    if(!navbar) return;

    window.addEventListener("scroll", () => {

        if(window.scrollY > 50){
            navbar.style.background = "rgba(0,0,0,0.6)";
            navbar.style.boxShadow = "0 5px 25px rgba(0,0,0,0.5)";
        }else{
            navbar.style.background = "rgba(0,0,0,0.35)";
            navbar.style.boxShadow = "none";
        }

    });

}
