const name = $('#name')
const password = $('#password')
const submit = $('#submit')
const register = $('#register-button')
submit.on("click", ()=>{
    $.ajax({
        type: "POST",
        url: "/login",
        data: JSON.stringify({username: name.val(), password: password.val()}),
        contentType: "application/json",
        success: (res)=>{
            $('body').replaceWith(res)
        },
        error: (xhr,status, err)=>{
            console.log(err)
        }
    })
    name.val("")
    password.val("")
})

register.on("click",()=>{
    window.location.href = "/register"
})
