function makeDate(day_number){

    today = new Date()

    day = day_number
    month = today.getMonth() + 1 
    year = today.getFullYear()

    if ( day < 10 ){

        day = `0${day}`
        
    }
    if ( month < 10 ){

        month = `0${month}`
        
    }



    today = `${year}-${month}-${day}`


    return today


}

module.exports = makeDate
