const submit = $("#submit")
const name = $("#name")
const password = $("#password")
const passwordAgain = $("#password-again")
const warning = $("#warning")

submit.on("click",()=>{

    if (password.val() && name.val()){
        if (password.val().length > 3 && password.val() === passwordAgain.val()){
            $.ajax({
                type: "POST",
                url: "/register",
                data: JSON.stringify({username: name.val(), password: password.val()}),
                contentType: "application/json",
                success: (res)=>{
                    console.log(res)
                },
                error: (xhr, status, error)=>{
                    console.log(error)
                }
            })
            name.val("")

        }else{
            warning.text("Password has to match and be more than 3 characters long")
        }
    
    }else{
        warning.text("Please fill out the Password and Username fields.")
    }
    password.val("")
    passwordAgain.val("")

})