

export function convertToImperial(MetricText){
    const arr = MetricText.split(" ")
    let count = 0
    for(let i=0; i<arr.length; i++){
        const unitString = arr[i].toLowerCase().replaceAll(/[^a-zA-Z0-9.,]/g,"").replace(/[.,]+$/, "")
        if(unitString.endsWith("centimeter")||unitString.endsWith("centimeters")||unitString.endsWith("centimetre")||unitString.endsWith("centimetres")||unitString.endsWith("cm")){//Length Start
            if(unitString==="centimeter"||unitString==="centimeters"||unitString==="centimetre"||unitString==="centimetres"||unitString==="cm"){//
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number/2.54).toFixed(2)//
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/centimeter(s)?|centimetre(s)?|cm/gi, "inches")//
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="centimeter"||unit==="centimeters"||unit==="centimetre"||unit==="centimetres"||unit==="cm"){//
                    const indexOfUnit = unitString.indexOf("c")// 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number/2.54).toFixed(2)//
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/centimeter(s)?|centimetre(s)?|cm/gi, "inches")//
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("meter")||unitString.endsWith("meters")||unitString.endsWith("metre")||unitString.endsWith("metres")||unitString.endsWith("m")){
            if(unitString==="meter"||unitString==="meters"||unitString==="metre"||unitString==="metres"||unitString==="m"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*3.281).toFixed(2)
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/meter(s)?|metre(s)?|m/gi, "feet")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="meter"||unit==="meters"||unit==="metre"||unit==="metres"||unit==="m"){
                    const indexOfUnit = unitString.indexOf("m") 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*3.281).toFixed(2)
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/meter(s)?|metre(s)?|m/gi, "feet")
                    count++
                    continue
                }
            }
        }
        
        if(unitString.endsWith("kilometer")||unitString.endsWith("kilometers")||unitString.endsWith("kilometre")||unitString.endsWith("kilometres")||unitString.endsWith("km")){ //
            
            if(unitString==="kilometer"||unitString==="kilometers"||unitString==="kilometre"||unitString==="kilometres"||unitString==="km"){ //
                
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.621).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/kilometer(s)?|kilometre(s)?|km/gi, "miles") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="kilometer"||unit==="kilometers"||unit==="kilometre"||unit==="kilometres"||unit==="km"){ //
                    const indexOfUnit = unitString.indexOf("k") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.621).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/kilometer(s)?|kilometre(s)?|km/gi, "miles") //
                    count++
                    continue
                }
            }
        }
        
        if(unitString.endsWith("gram")||unitString.endsWith("grams")||unitString.endsWith("g")){ //
            if(unitString==="gram"||unitString==="grams"||unitString==="g"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.0353).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/gram(s)?|g/gi, "oz") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="gram"||unit==="grams"||unit==="g"){ //
                    const indexOfUnit = unitString.indexOf("g") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.0353).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/gram(s)?|g/gi, "oz") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("kilogram")||unitString.endsWith("kilograms")||unitString.endsWith("kg")){ //
            if(unitString==="kilogram"||unitString==="kilograms"||unitString==="kg"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*2.205).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/kilogram(s)?|kg/gi, "lb") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="kilogram"||unit==="kilograms"||unit==="kg"){ //
                    const indexOfUnit = unitString.indexOf("k") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*2.205).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/kilogram(s)?|kg/gi, "lb") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("milliliter")||unitString.endsWith("milliliters")||unitString.endsWith("millilitre")||unitString.endsWith("millilitres")||unitString.endsWith("ml")){ //
            if(unitString==="milliliter"||unitString==="milliliters"||unitString==="millilitre"||unitString==="millilitres"||unitString==="ml"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                let conversionRate = 0
                let newUnit = ""
                if(Math.abs(number)<=15){
                    conversionRate = 0.203
                    newUnit = "tsp"
                }else if(Math.abs(number)<=60){
                    conversionRate = 0.0676
                    newUnit = "tbsp"
                }else{
                    conversionRate = 0.0338
                    newUnit = "fl oz"
                }

                const convertedNumber = +(number*conversionRate).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/milliliter(s)?|millilitre(s)?|ml/gi, newUnit) //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="milliliter"||unit==="milliliters"||unit==="millilitre"||unit==="millilitres"||unit==="ml"){ //
                    const indexOfUnit = unitString.indexOf("m") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    let conversionRate = 0
                    let newUnit = ""
                    if(Math.abs(number)<=15){
                        conversionRate = 0.203
                        newUnit = "tsp"
                    }else if(Math.abs(number)<=60){
                        conversionRate = 0.0676
                        newUnit = "tbsp"
                    }else{
                        conversionRate = 0.0338
                        newUnit = "fl oz"
                    }
                    const convertedNumber = +(number*conversionRate).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/milliliter(s)?|millilitre(s)?|ml/gi, newUnit) //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("liter")||unitString.endsWith("liters")||unitString.endsWith("litre")||unitString.endsWith("litres")||unitString.endsWith("l")){ //
            if(unitString==="liter"||unitString==="liters"||unitString==="litre"||unitString==="litres"||unitString==="l"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                let conversionRate = 0
                let newUnit = ""
                if(Math.abs(number)<=1){
                    conversionRate = 33.814
                    newUnit = "fl oz"
                }else if(Math.abs(number)<2){
                    conversionRate = 2.11338
                    newUnit = "pints"
                }else{
                    conversionRate = 0.2642
                    newUnit = "gallons"
                }

                const convertedNumber = +(number*conversionRate).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/liter(s)?|litre(s)?|l/gi, newUnit) //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="liter"||unit==="liters"||unit==="litre"||unit==="litres"||unit==="l"){ //
                    const indexOfUnit = unitString.indexOf("l") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    let conversionRate = 0
                    let newUnit = ""
                    if(Math.abs(number)<=1){
                        conversionRate = 33.814
                        newUnit = "fl oz"
                    }else if(Math.abs(number)<2){
                        conversionRate = 2.11338
                        newUnit = "pints"
                    }else{
                        conversionRate = 0.2642
                        newUnit = "gallons"
                    }
                    const convertedNumber = +(number*conversionRate).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/liter(s)?|litre(s)?|l/gi, newUnit) //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("c")||unitString.endsWith("celcius")||unitString.endsWith("celsius"||unitString.endsWith("centigrade"))||unitString.endsWith("centigrades")){ //
           
            if(unitString==="c"||unitString==="celcius"||unitString==="celsius"||unitString==="centigrade"||unitString==="centigrades"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*1.8+32).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replaceAll("°","").replace(/celsius?|celcius?|centigrade(s)?|c/gi, "°F") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="celsius"||unit==="celcius"||unit==="c"||unit==="centigrade"||unit==="centigrades"){ //
                    const indexOfUnit = unitString.indexOf("c") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*1.8+32).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replaceAll("°","").replace(/celsius?|celcius?|centigrade(s)?|c/gi, "°F") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("degree")||unitString.endsWith("degrees")){ //
            if(i===arr.length-1){
                continue
            }
            const nextWord = arr[i+1].replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()
            if(nextWord!=="celsius"&&nextWord!=="celcius"&&nextWord!=="centigrade"&&nextWord!=="centigrades"&&nextWord!=="c"){
                continue
            }
            if(unitString==="degree"||unitString==="degrees"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*1.8+32).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/degrees?|degree/gi, "°F") //
                arr[i+1] = arr[i+1].replaceAll("°","").replace(/celsius?|celcius?|centigrades?|centigrade?|c/gi,"")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="degree"||unit==="degrees"){ //
                    const indexOfUnit = unitString.indexOf("d") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*1.8+32).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/degrees?|degree/gi, "°F") //
                    arr[i+1] = arr[i+1].replaceAll("°","").replace(/celsius?|celcius?|centigrades?|centigrade?|c/gi,"")
                    count++
                    continue
                }
                
            }
        }
    }
    if(count>0){
        let ConvertedText=arr[0];
        for(let i=1; i<arr.length; i++){
            ConvertedText = ConvertedText + " " + arr[i] 
        }
        return ConvertedText
    }else{
        return MetricText
    }
}

export function convertToMetric(ImperialText){
    const arr = ImperialText.split(" ")
    let count = 0
    for(let i=0; i<arr.length; i++){
        const unitString = arr[i].toLowerCase().replaceAll(/[^a-zA-Z0-9.,]/g,"").replace(/[.,]+$/, "")
        if(unitString.endsWith("inch")||unitString.endsWith("inches")){//Length Start
            if(unitString==="inch"||unitString==="inches"){//
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*2.54).toFixed(2)//
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/inch(es)?/gi, "cm")//
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="inch"||unit==="inches"){//
                    const indexOfUnit = unitString.indexOf("i")// 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*2.54).toFixed(2)//
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/inch(es)?/gi, "cm")//
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("yard")||unitString.endsWith("yards")||unitString.endsWith("yd")||unitString.endsWith("yds")){
            if(unitString==="yard"||unitString==="yards"||unitString==="yd"||unitString==="yds"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.9144).toFixed(2)
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/yd(s)?|yards?|yard/gi, "m")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="yard"||unit==="yards"||unit==="yd"||unit==="yds"){
                    const indexOfUnit = unitString.indexOf("y") 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.9144).toFixed(2)
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/yd(s)?|yards?|yard/gi, "m")
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("foot")||unitString.endsWith("ft")||unitString.endsWith("feet")){
            if(unitString==="foot"||unitString==="ft"||unitString==="feet"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.3048).toFixed(2)
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/foot?|feet?|ft/gi, "m")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="foot"||unit==="feet"||unit==="ft"){
                    const indexOfUnit = unitString.indexOf("f") 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.3048).toFixed(2)
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/foot?|feet?|ft/gi, "m")
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("mile")||unitString.endsWith("miles")){
            if(unitString==="mile"||unitString==="miles"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*1.609).toFixed(2)
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/miles?|mile/gi, "km")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="mile"||unit==="miles"){
                    const indexOfUnit = unitString.indexOf("m") 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*1.609).toFixed(2)
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/miles?|mile/gi, "km") 
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("ounce")||unitString.endsWith("ounces")||unitString.endsWith("oz")){ //Weight start
            if(unitString==="ounce"||unitString==="ounces"||unitString==="oz"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*28.35).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/ounce(s)?|oz/gi, "g") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="ounce"||unit==="ounces"||unit==="oz"){ //
                    const indexOfUnit = unitString.indexOf("o") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*28.35).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/ounce(s)?|oz/gi, "g") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("pound")||unitString.endsWith("pounds")||unitString.endsWith("lb")||unitString.endsWith("lbs")){ //
            if(unitString==="pound"||unitString==="pounds"||unitString==="lb"||unitString==="lbs"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.454).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/pound(s)?|lbs?|lb/gi, "kg") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="pound"||unit==="pounds"||unit==="lb"||unit==="lbs"){ //
                    let indexOfUnit = 0
                    if(unit.startsWith("p")){
                        indexOfUnit = unitString.indexOf("p")
                    }else{
                        indexOfUnit = unitString.indexOf("l")
                    } 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.454).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/pound(s)?|lbs?|lb/gi, "kg") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("teaspoon")||unitString.endsWith("teaspoons")||unitString.endsWith("tsp")||unitString.endsWith("tsps")){ //Volume start //assumes US teaspoon
            if(unitString==="teaspoon"||unitString==="teaspoons"||unitString==="tsp"||unitString==="tsps"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*4.929).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/teaspoon(s)?|tsps?|tsp/gi, "ml") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="teaspoon"||unit==="teaspoons"||unit==="tsp"||unit==="tsps"){ //
                    const indexOfUnit = unitString.indexOf("t") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*4.929).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/teaspoon(s)?|tsps?|tsp/gi, "ml") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("tablespoon")||unitString.endsWith("tablespoons")||unitString.endsWith("tbsp")||unitString.endsWith("tbsps")){ //assumes US tablespoon
            if(unitString==="tablespoon"||unitString==="tablespoons"||unitString==="tbsp"||unitString==="tbsps"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*14.787).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/tablespoon(s)?|tbsps?|tbsp/gi, "ml") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="tablespoon"||unit==="tablespoons"||unit==="tbsp"||unit==="tbsps"){ //
                    const indexOfUnit = unitString.indexOf("t") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*14.787).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/tablespoon(s)?|tbsps?|tbsp/gi, "ml") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("cup")||unitString.endsWith("cups")){ //assumes US legal cup
            if(unitString==="cup"||unitString==="cups"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*240).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/cups?|cup/gi, "ml") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="cup"||unit==="cups"){ //
                    const indexOfUnit = unitString.indexOf("c") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*240).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/cups?|cup/gi, "ml") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("pint")||unitString.endsWith("pints")||unitString.endsWith("pt")||unitString.endsWith("pts")){ //assumes US liquid pint
            if(unitString==="pint"||unitString==="pints"||unitString==="pt"||unitString==="pts"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.473).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/pint(s)?|pts?|pt/gi, "L") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="pint"||unit==="pints"||unit==="pt"||unit==="pts"){ //
                    const indexOfUnit = unitString.indexOf("p") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.473).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/pint(s)?|pts?|pt/gi, "L") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("quart")||unitString.endsWith("quarts")||unitString.endsWith("qt")||unitString.endsWith("qts")){ //assumes US quart
            if(unitString==="quart"||unitString==="quarts"||unitString==="qt"||unitString==="qts"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*0.946).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/quart(s)?|qt(s)?/gi, "L") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="quart"||unit==="quarts"||unit==="qt"||unit==="qts"){ //
                    const indexOfUnit = unitString.indexOf("q") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*0.946).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/quart(s)?|qt(s)?/gi, "L") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("gallon")||unitString.endsWith("gallons")||unitString.endsWith("gal")||unitString.endsWith("gals")){ //assumes US liquid gallons
            if(unitString==="gallon"||unitString==="gallons"||unitString==="gal"||unitString==="gals"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*3.785).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/gallon(s)?|gal(s)?/gi, "L") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="gallon"||unit==="gallons"||unit==="gal"||unit==="gals"){ //
                    const indexOfUnit = unitString.indexOf("g") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*3.785).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/gallon(s)?|gal(s)?/gi, "L") //
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("fluid")||unitString.endsWith("fl")){ //assumes US fluid ounce
            if(i===arr.length-1){
                continue
            }
            const nextWord = arr[i+1].replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()
            if(nextWord!=="ounce"&&nextWord!=="oz"&&nextWord!=="ounces"){
                continue
            }
            if(unitString==="fluid"||unitString==="fl"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +(number*29.574).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/fluid?|fl/gi, "ml") //
                arr[i+1] = arr[i+1].replace(/ounce(s)?|oz/gi,"")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="fluid"||unit==="fl"){ //
                    const indexOfUnit = unitString.indexOf("f") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +(number*29.574).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/fluid?|fl/gi, "ml") //
                    arr[i+1] = arr[i+1].replace(/ounce(s)?|oz/gi,"")
                    count++
                    continue
                }
                
            }
        }
        
        if(unitString.endsWith("f")||unitString.endsWith("fahrenheit")||unitString.endsWith("fahrenheits")){ //
            if(unitString==="f"||unitString==="fahrenheit"||unitString==="fahrenheits"){ //
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +((number-32)*(5/9)).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replaceAll("°","").replace(/fahrenheit?|fahrenheits?|f/gi, "°C") //
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="fahrenheit"||unit==="fahrenheits"||unit==="f"){ //
                    const indexOfUnit = unitString.indexOf("f") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +((number-32)*(5/9)).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replaceAll("°","").replace(/fahrenheit(s)?|f/gi, "°C") //
                    count++
                    continue
                }
            }
        }
        
        if(unitString.endsWith("degree")||unitString.endsWith("degrees")){ //
            if(i===arr.length-1){
                continue
            }
            const nextWord = arr[i+1].replaceAll(/[^a-zA-Z0-9]/g,"").toLowerCase()
            if(nextWord!=="fahrenheit"&&nextWord!=="fahrenheits"&&nextWord!=="f"){
                continue
            }
            if(unitString==="degree"||unitString==="degrees"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(/[,(]/g,""))
                if(!number){
                    continue
                }
                const convertedNumber = +((number-32)*(5/9)).toFixed(2) //
                arr[i-1] = arr[i-1].replace(arr[i-1].replaceAll("(",""), convertedNumber)
                arr[i] = arr[i].replace(/degrees?|degree/gi, "°C") //
                arr[i+1] = arr[i+1].replaceAll("°","").replace(/fahrenheits?|fahrenheit?|f/gi,"")
                count++
                continue
            }else{
                const unit = unitString.replaceAll(/[0-9.,]/g,"")
                if(unit==="degree"||unit==="degrees"){ //
                    const indexOfUnit = unitString.indexOf("d") // 
                    const number = Number(unitString.substring(0, indexOfUnit).replaceAll(",",""))
                    if(!number){
                        continue
                    }
                    const convertedNumber = +((number-32)*(5/9)).toFixed(2) //
                    arr[i] = arr[i].replace(unitString.substring(0, indexOfUnit), convertedNumber).replace(/degrees?|degree/gi, "°C") //
                    arr[i+1] = arr[i+1].replaceAll("°","").replace(/fahrenheits?|fahrenheit?|f/gi,"")
                    count++
                    continue
                }
                
            }
        }
    }

    if(count>0){
        let ConvertedText=arr[0];
        for(let i=1; i<arr.length; i++){
            ConvertedText = ConvertedText + " " + arr[i] 
        }
        return ConvertedText
    }else{
        return ImperialText
    }
}

