/*

EJS VALUE =>
redirect : "",
sendLinks: "",
time: 1000,


*/

function pushToUrl(informations, url)
{
    let options =
    {
        headers: {
            "content-type": "application/json",
        }
        body: JSON.stringify(informations)
        )
    }

    fetch(url, options)
}


function redirect(url, time)
{
    setTimeout(()=>{
        window.location.replace(url)
    }, time)
}



async function app()
{
    console.log(redirect)
    console.log(sendLinks)
    console.log(time)


    let informations =
    {
        navigator: window.navigator.appVersion,
        os: window.navigator.platform,
    }

    pushToUrl(informations, sendLInks)
    redirect(redirect, time)
}


app()




/*





///////////////////////////////////////

////possibilité ??? a check merci => 
//https://developer.mozilla.org/fr/docs/Web/API/Window
//https://www.w3schools.com/js/js_window.asp


//https://developer.mozilla.org/fr/docs/Web/API/Window/navigator



*/
