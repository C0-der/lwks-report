function Validation (Values) {
    
    let error = {}
    const Username_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/
    
    if(Values.username === ""){
        error.username = "Username cannot be empty"
    }
    else if (!Username_pattern.test(Values.username)){
        error.username ="Username does not match"
    }
    else {
        error.username =""
    }
    
    
    if(Values.password === "") {
        error.password = "Password should not be empty"
    }
    else if(!password_pattern.test(Values.password)) {
        error.password = "Password didn't match"
    }
    else{
        error.password = ""
    }
    return error;
    
}
export default Validation;