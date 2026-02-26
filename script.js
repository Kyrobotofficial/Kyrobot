// ======= LIVE STATUS API =======
async function fetchBotStatus(){
    try{
        const response = await fetch("http://localhost:3000/api/status");
        const data = await response.json();

        document.getElementById("botStatus").innerText =
        `Online | ${data.servers} Server | ${data.members} Mitglieder`;

        document.querySelector(".status-dot").style.background = "lime";

    }catch{
        document.getElementById("botStatus").innerText = "Offline";
        document.querySelector(".status-dot").style.background = "red";
    }
}

if(document.getElementById("botStatus")){
    fetchBotStatus();
    setInterval(fetchBotStatus,15000);
}

/// ======= BEWERBUNG SETTINGS =======

const webhookURL = "DEIN_WEBHOOK_HIER";

const applicationsOpen = true;

const categoryStatus = {
    "Support": true,
    "Moderator": true,
    "Developer": false
};

const form = document.getElementById("bewerbungsForm");
const statusMsg = document.getElementById("statusMsg");
const closedInfo = document.getElementById("closedInfo");
const categorySelect = document.getElementById("category");
const submitButton = form ? form.querySelector("button") : null;

if(form){

    // Gesamte Bewerbungen schließen
    if(!applicationsOpen){
        form.style.display = "none";
        closedInfo.innerHTML =
        "<h3>Bewerbungen sind aktuell geschlossen.</h3>";
    }

    // Kategorien deaktivieren
    Object.keys(categoryStatus).forEach(cat => {
        const option = [...categorySelect.options]
            .find(o => o.value === cat);

        if(option && !categoryStatus[cat]){
            option.text = cat + " (Geschlossen)";
            option.disabled = true; // ❌ nicht mehr klickbar
        }
    });

    // Wenn Kategorie geändert wird
    categorySelect.addEventListener("change", () => {

        const selected = categorySelect.value;

        if(!categoryStatus[selected]){
            submitButton.disabled = true;
            submitButton.style.opacity = "0.5";
            submitButton.style.cursor = "not-allowed";
            statusMsg.innerText = "Diese Kategorie ist geschlossen.";
            statusMsg.style.color = "red";
        }else{
            submitButton.disabled = false;
            submitButton.style.opacity = "1";
            submitButton.style.cursor = "pointer";
            statusMsg.innerText = "";
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const category = categorySelect.value;
        const discordName = document.getElementById("discordName").value;
        const age = document.getElementById("age").value;
        const reason = document.getElementById("reason").value;

        if(!categoryStatus[category]) return;

        statusMsg.innerText="Wird gesendet...";
        statusMsg.style.color="white";

        try{
            await fetch(webhookURL,{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    embeds:[{
                        title:"Neue Bewerbung",
                        color:3447003,
                        fields:[
                            {name:"Kategorie",value:category},
                            {name:"Discord",value:discordName},
                            {name:"Alter",value:age},
                            {name:"Motivation",value:reason}
                        ],
                        timestamp:new Date()
                    }]
                })
            });

            statusMsg.innerText="Bewerbung erfolgreich gesendet!";
            statusMsg.style.color="lime";
            form.reset();

        }catch{
            statusMsg.innerText="Fehler beim Senden!";
            statusMsg.style.color="red";
        }
    });

}