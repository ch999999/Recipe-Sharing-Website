//Imperial Lengths
//Inch in Inches
//Foot ft Feet
//Yard yd Yards
//Mile Miles

//SI Lengths
//Millimeter mm Millimeters
//Centimeter cm Centimeters
//Meter m Meters
//Kilometer km Kilometers

const text = "200.9Inches"
function convertToSI(FreedomText){
    const arr = FreedomText.split(" ")
    let count = 0;
    for(let i=0; i<arr.length; i++){
        const oriString = arr[i].toLowerCase().replaceAll(/[^a-zA-Z0-9.]/g,"").replace(/\.*$/, "")
        //const oriString = arr[i].toLowerCase().replaceAll(/[^a-zA-Z0-9]/g,"")
        if(oriString.endsWith("inch")||oriString.endsWith("inches")){
            if(oriString==="inch"||oriString==="inches"){
                if(i===0){
                    continue
                }
                const number = Number(arr[i-1].replaceAll(",",""))
                if(!number){
                    continue
                }
                arr[i-1] = number*2.54
                arr[i] = arr[i].replace(/inch(es)?/gi, "cm")
                count++
            }else{
                const unit = oriString.replaceAll(/[0-9.]/g,"")
                if(unit!=="inch"||unit!=="inches"){
                    continue
                }
                const indexOfI = oriString.indexOf("i") 
                const number = Number(oriString.substring(0, indexOfI).replaceAll(",",""))
                if(!number){
                    continue
                }
                const siNumber = number*2.54
                const siUnit = arr[i].replaceAll(/[0-9]/g,"").replace(/^\.+/,"").replace(/inch(es)?/gi, "cm")
                arr[i] = siNumber+siUnit
                count++
            }
            
        }else if(oriString.endsWith("yard")||oriString.endsWith("yards")||oriString.endsWith("yd")||oriString.endsWith("yds")){

        }
    }

    if(count>0){
        let SIText=arr[0];
        for(let i=1; i<arr.length; i++){
            SIText = SIText + " " + arr[i] 
        }
        console.log(SIText)
    }else{
        console.log(FreedomText)
    }
}

convertToSI(text)