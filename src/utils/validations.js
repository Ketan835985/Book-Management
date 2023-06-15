const titleCheck = (str)=>{
    let arr = ["Mr", "Mrs", "Miss"]
    if(arr.includes(str)) return true
    return false
}

const passwordCheck = (str)=>{
    if(str.length < 8 || str.length > 15) return false
    return true
}

module.exports = {
    titleCheck,
    passwordCheck
}