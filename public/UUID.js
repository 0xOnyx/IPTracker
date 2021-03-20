
//ADD =>
//https://getbootstrap.com/docs/5.0/components/toasts/

let socket = io(`${host}:${port}`)

socket.on(UUID + "Info", (message)=>{
    console.log(message)
})

socket.on(UUID + "Connection", (message)=>{
    console.log(message)
})

