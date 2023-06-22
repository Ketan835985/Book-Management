const titleCheck = (str)=>{
    let arr = ["Mr", "Mrs", "Miss"]
    if(arr.includes(str)) return true
    return false
}

const passwordCheck = (str)=>{
    if(str.length < 8 || str.length > 15) return false
    return true
}

const ratingRange = (rating)=>{
    rating = JSON.stringify(Number(rating))
    if(rating < 1 || rating > 5) return false
    return true
}

module.exports = {
    titleCheck,
    passwordCheck,
    ratingRange
}