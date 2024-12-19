/**
 * saved.js
 * 
 * This file handles saving and deleting preferences to storage for future access, 
 * as well as setting up the saved page for user interaction.
 */


document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
    if (isDarkMode) {
        document.body.classList.add('no-transition');
        document.body.classList.add('dark-mode');
        
        setTimeout(() => {
            document.body.classList.remove('no-transition');
        }, 10);
    }
});

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
        

        <div class ="textbox" style="text-align: center;">
            ${userPrefs[i].prefName}
            <div>
                <span id="maxTempLoad" class="prefValue" display="block" style="text-align: left; padding-left=15px">
                    <p> Max Temperature:    ${maxTempDisplay(i)} ${findMetOrImp("t")}</p>
                </span>

                <span id="minTempLoad" class="prefValue" display="block" style="text-align: left;">
                    <p> Min Temperature:    ${minTempDisplay(i)} ${findMetOrImp("t")}</p>
                </span>

                <span id="avgTempLoad" class="prefValue" display="block" style="text-align: left; justify-content: left;">
                    <p> Average Temperature:     ${avgTempDisplay(i)} ${findMetOrImp("t")}</p>
                </span>

                <span id="precipLoad" class="prefValue" display="block" style="text-align: left;">
                    <p> Average Precipitation:    ${avgPrcpDisplay(i)} ${findMetOrImp("p")}</p>
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

/**
 * Creates a "Delete Preference" button.
 * @param {number} [i=0] - The index of the associated saved preferences. 
 * @returns {void|null} If everything works properly, nothing is returned. If there is no button container available, returns null.
 */
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

/**
 * Creates a "Load Preference" button.
 * @param {number} [i=0] - The index of the associated saved preferences.
 * @returns {void|null} If everything works properly, nothing is returned. If there is no button container available, returns null.
 */
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

/**
 * Deletes the chosen preference.
 * @param {number} i - The index of the saved preference to delete.
 */
function deletePreference(i)
{
    //remove the specified index from the local copy of userPrefs 
    userPrefs.splice(i, 1);
    //update local Storage with the new userPrefs array
    localStorage.setItem("userPrefs", JSON.stringify(userPrefs))
    //reload page
    location.reload();
}

/**
 * Loads the chosen preference on the home page.
 * @param {*} i - The index of the saved preference to load.
 */
function loadPreferences(i)
{
    let prefToLoad = userPrefs[i];
    sessionStorage.setItem("prefToLoad", JSON.stringify(prefToLoad))
    window.location.href = "./index.html"
}

/**
 * Returns the units to be displayed depending on metric vs imperial setting.
 * @param {"t"|"p"} torp - "t" for temperature or "p" for precipitation
 * @returns {"F"|"C"|"in."|"mm"} Unit to be displayed.
 */
function findMetOrImp(torp)
{
    let pref = localStorage.getItem("prefUnits")
    if(torp == "t")
    {
        if(pref == "imp")
            {
                return "F"
            }
            
            else
            {
                return "C"
            }
    }
    else
    {
        if(pref == "imp")
        {
                return "in.";
        }
        else
        {
                return "mm"
        }
    }

}

/**
 * Displays the saved minimum temperature in the chosen measurement system.
 * @param {number} i - The index of the associated saved preferences.
 * @returns {number} The saved minimum temperature at index `i` in degrees Fahrenheit or Celsius.
 */
function minTempDisplay(i)
{
    let pref = localStorage.getItem("prefUnits")
    let temp = JSON.parse(userPrefs[i].tmin)
    if(pref == "imp")
    {
        return Math.floor((temp* 9 / 5) + 32)
    }
    else if(pref =="met")
    {
        return temp
    }
}

/**
 * Displays the saved maximum temperature in the chosen measurement system.
 * @param {number} i - The index of the associated saved preferences.
 * @returns {number} The saved maximum temperature at index `i` in degrees Fahrenheit or Celsius.
 */
function maxTempDisplay(i)
{
    let pref = localStorage.getItem("prefUnits")
    let temp = JSON.parse(userPrefs[i].tmax)
    if(pref == "imp")
    {
        return Math.floor((temp* 9 / 5) + 32)
    }
    else if(pref =="met")
    {
        return temp
    }
}

/**
 * Displays the saved average temperature in the chosen measurement system.
 * @param {number} i - The index of the associated saved preferences.
 * @returns {number} The saved average temperature at index `i` in degrees Fahrenheit or Celsius.
 */
function avgTempDisplay(i)
{
    let pref = localStorage.getItem("prefUnits")
    let temp = JSON.parse(userPrefs[i].tempavg)
    if(pref == "imp")
    {
        return Math.floor((temp* 9 / 5) + 32)
    }
    else if(pref =="met")
    {
        return temp
    }
}

/**
 * Displays the saved average precipitation in the correct measurement system.
 * @param {number} i - The index of the associated saved preferences.
 * @returns {number} The saved average precipitation at index `i` in in. or mm.
 */
function avgPrcpDisplay(i)
{
    let pref = localStorage.getItem("prefUnits")
    let temp = JSON.parse(userPrefs[i].avgprcp)
    if(pref == "imp")
    {
        return Math.round((temp/25.4)*10)/10
    }
    else if(pref =="met")
    {
        return temp
    }
}

/**
 * ???
 */
function precipDisplay()
{

}
