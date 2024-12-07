// Get the JSON string from local storage 
let prefString = localStorage.getItem('userPrefs');
 // Convert the JSON string back to an array of objects 
let userPrefs = JSON.parse(prefString);


let olDiv = document.getElementById("prefList")

for(let i =0; i < userPrefs.length; i++)
{
    let li = document.createElement("li")

    olDiv.appendChild(li)
    
    li.innerHTML = 
    `
    <div class="container">
        <div class="picbox">
            <img src="https://th.bing.com/th/id/OIP.gaONo-dcX0Z0cUNsTAHWMgHaHa?rs=1&pid=ImgDetMain">
        </div>

        <div class ="textbox" style="text-align: center;">
            ${userPrefs[i].prefName}
            <div>
                <span class="prefValue" display="block" style="text-align: left; padding-left=15px">
                    <p> Max Temperature:    ${userPrefs[i].tmax}</p>
                </span>

                <span class="prefValue" display="block" style="text-align: left;">
                    <p> Min Temperature:    ${userPrefs[i].tmin}</p>
                </span>

                <span class="prefValue" display="block" style="text-align: left; justify-content: left;">
                    <p> Average Temperature:     ${userPrefs[i].tempavg}</p>
                </span>

                <span class="prefValue" display="block" style="text-align: left;">
                    <p> Average Precipitation:    ${userPrefs[i].avgprcp}</p>
                </span>
                <div id=button-container${i}>

                </div>
            </div>

        </div>
    </div>
    `;
    createDeleteButton(i)
    createLoadButton(i)
}


function createDeleteButton(i=0)
{
    //define the button we want
    const button = document.createElement('button')
    const button_container = document.getElementById("button-container"+i)
    button.id = i;
    button.innerText = "Delete Preference"


    //if the button container exists add the button as its child
    if(button_container)
    {
        button_container.appendChild(button);
    }
    //otherwise stop and do nothing
    else
    {
        console.log("no button container available")
        return null
    }

    //add the buttons event listener
    button.addEventListener("click", () => {
        console.log("deleting button: " + i)
        deletePreference(i);
    })
    
}

function createLoadButton(i=0)
{
    //define the button we want created
    const button = document.createElement('button')
    const button_container = document.getElementById("button-container"+i)
    button.id = i;
    button.innerText = "Load Preference"


    //if the button_container exists add the button as its child
    if(button_container)
    {
        button_container.appendChild(button);
    }
    //otherwise stop and do nothing
    else
    {
        return null;
    }

    //add the event listener to the button
    button.addEventListener("click", () => {
        console.log("Loading button: " + i)
        loadPreferences(i);
    })
    
}



function deletePreference(i)
{
    //remove the specified index from the local copy of userPrefs 
    userPrefs.splice(i, 1);
    //update local Storage with the new userPrefs array
    localStorage.setItem("userPrefs", JSON.stringify(userPrefs))
    //reload page
    location.reload();
}

function loadPreferences(i)
{
    let prefToLoad = userPrefs[i];
    sessionStorage.setItem("prefToLoad", JSON.stringify(prefToLoad))
    window.location.href = "./index.html"
}
