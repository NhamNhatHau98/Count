const fs = require('fs')

const type1Regex = /^[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s\d\(\)\-\.\,\%\:\']+[\d\s\,\.\(\)\%]+?(mg|mcg|g|m|gam|ml|kg|lít|tế bào|mCi|mmol|µg|microkatals|mckatal|micro\skatals|microkatal)$/i
const typ1ReverseRegex = /^[\d\s\,\.\%\-]+?(mg|mcg|g|m|gam|ml|kg|lít|tế bào|mCi|mmol|µg)[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\-\,\%\d\s]+$/i
const type2Regex = /^[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\d\s\(\)\-]+[\d\.\s\,]+?(IU|UI|USP|U|I.U|M.IU|M.I.U|M. IU|MU|đvqt|MIU|M UI|CFU|F.I.P units|đơn vị|units|đơn vị USP|PFU)$/i
const type3Regex = /^[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s\-\.\[\]]*(\d|\D)(\d|\D)$|^\w$/i
const type4Regex = /^[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\-/.\s\d]+[\d\s/,/.]+%/i
const type5Regex = /^[A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\d\s\-\(\)\.\,]+[\d\,\.\%\-\s]+[a-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s\.]+\/[\.\,\s\da-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]+$/i
const removeBracketsRegex = /\([^\(\)]+\)$|\([^\(\)]+\)/i
const removeColonRegex = /^[A-Za-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s\d\,\%\/\-]+?(chứa \:|chứa\:+|tương đương:|tương đương :|dưới dạng:|dưới dạng :|tương ứng:|tương ứng :|dược liệu:|dược liệu :|gồm:|gồm :|với:|với :|sau:|sau :|khô:|khô :|từ:|từ :|dịch chiết:|dịch chiết :|của:|của :)/i
const removeEndingCharacterRegex = /[,.:-\s\…;\)]+$/i
const removeSpecialStringRegex1 = /dưới dạng [A-ZàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s]+$/i
const removeSpecialStringRegex2 = /^[A-Za-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\w\s\,\%\-\.]+?(tương đương với|tương đương|tương ứng với|tương ứng)/i
const vitaminRegex = /^Vitamin[\sA-Za-z]+\d+$|^Vitamin[\sA-Za-z]+\d+[\s\w\.\,\/\%]+$/i

let countDrug = {
    firstType: 0,
    secondType: 0,
    thirdType: 0,
    fourthType: 0,
    fifthType: 0,
    sixthType: 0,
    seventhType: 0,
    eighthType: 0,
    ninthType: 0,
    tenthType: 0,
    eleventhType: 0,
    countedType: 0,
    rest: 0,
    allType: 0,
}
let hashName = {}
let hasIngredient = {}
let mySet = new Set()

function handleName(name) {
    name = name.split(removeBracketsRegex).join('').trim()
    name = name.split(removeBracketsRegex).join('').trim()
    name = name.replace('≥', '')
    name = name.split(removeEndingCharacterRegex).join('').trim()
    let removeColonPart = name.match(removeColonRegex)
    if (removeColonPart) {
        name = name.split(removeColonPart[0]).join('').trim()
    }
    name = name.split(removeSpecialStringRegex1).join('').trim()
    let removeSpecialPart2 = name.match(removeSpecialStringRegex2)
    if (removeSpecialPart2) {
        // console.log(name);
        name = name.split(removeSpecialPart2[0]).join('').trim()
    }
    return name
}

function splitType1(item, name) {
    let concentration, ingredient
    let tempConcentration = name.match(/[\d\s\,\.\(\)\%]+?(mg|mcg|g|m|gam|ml|kg|lít|tế bào|mCi|mmol|µg|microkatals|mckatal|micro\skatals|microkatal)$/i)
    if (tempConcentration) {
        concentration = tempConcentration[0].trim()
        if (concentration) {
            ingredient = name.split(concentration)[0].trim()
        }
    }
    if (concentration && ingredient) {
        let obj = {
            ingredient,
            concentration
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

function splitType1Reverse(item, name) {
    let concentration, ingredient
    let tempConcentration = name.match(/^[\d\s\,\.\%\-]+?(mg|mcg|g|m|gam|ml|kg|lít|tế bào|mCi|mmol|µg)/i)
    if (tempConcentration) {
        concentration = tempConcentration[0].trim()
        if (concentration) {
            ingredient = name.split(concentration)[1].trim()
        }
    }
    if (concentration && ingredient) {
        let obj = {
            ingredient,
            concentration
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

function splitType2(item, name) {
    let concentration = name.match(/[\d\.\s\(\)\%]+[\s\,]?(IU|UI|USP|U|I.U|M.IU|M.I.U|M. IU|MU|M UI|đvqt|MIU|CFU|F.I.P units|đơn vị|units|đơn vị USP|PFU)$/i)[0].trim()
    let ingredient = name.split(concentration)[0].trim()
    if (concentration && ingredient) {
        let obj = {
            ingredient,
            concentration
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

function splitType4(item, name) {
    let concentration = name.match(/[\d\s/,/.]+%/i)[0].trim()
    let ingredient = name.split(concentration)[0].trim()
    if (concentration && ingredient) {
        let obj = {
            ingredient,
            concentration,
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

function splitType5(item, name) {
    let tempConcentration = name.match(/(\d+[\d\,\.\%]+|\d+)[a-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ\s\.]+\/[\.\,\s\da-zàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬđĐèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆìÌỉỈĩĨíÍịỊòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰỳỲỷỶỹỸýÝỵỴ]+$/i)
    let concentration
    if (tempConcentration) {
        concentration = tempConcentration[0]
    }
    let ingredient = name.split(concentration)[0].trim()
    if (concentration && ingredient) {
        let obj = {
            ingredient,
            concentration,
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

function splitVitaminType(item, name) {
    let tempIngredient = name.match(/Vitamin[\s]+\w\d+|Vitamin[\s]+\w+/i)
    let ingredient
    if (tempIngredient) {
        ingredient = tempIngredient[0]
    }
    let tempConcentration = name.split(ingredient)
    let concentration
    if (tempConcentration[1]) {
        concentration = tempConcentration[1]
    }
    else {
        concentration = null
    }
    //if (concentration && ingredient) {
    let obj = {
        ingredient,
        concentration,
    }
    item.detailDrug.concentrationArr.push(obj)
}

function splitType3(item, name) {
    let ingredient = name.match(type3Regex)[0].trim()
    let concentration = item.detailDrug.concentration
    if (ingredient) {
        let obj = {
            ingredient,
            concentration
        }
        item.detailDrug.concentrationArr.push(obj)
    }
}

for (let i = 0; i <= 42000; i += 500) {
    let listDrug = require(`./standardDrug3Full/skip${i}`)
    let stockModels = []
    listDrug.forEach((item, index) => {
        let name = (item.detailDrug.ingredients);
        if (name) {
            name = handleName(name)
            countDrug.allType++
        }
        if (name && type1Regex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType1(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.firstType++
                countDrug.countedType++
                stockModels.push(item)

            }
        }
        if (name && typ1ReverseRegex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType1Reverse(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.eighthType++
                countDrug.countedType++
                stockModels.push(item)

            }
        }
        if (name && type2Regex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType2(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.secondType++
                countDrug.countedType++
                stockModels.push(item)

            }
        }
        if (name && type4Regex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType4(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.fourthType++
                countDrug.countedType++
                stockModels.push(item)
                // console.log('ingredients  : ', item.detailDrug.ingredients);
                // console.log('concentration: ', item.detailDrug.concentration);
                // console.log('concenArr    : ', item.detailDrug.concentrationArr, '\n');
            }

        }
        if (name && type5Regex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType5(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.fifthType++
                countDrug.countedType++
                stockModels.push(item)
                // console.log('ingredients  : ', item.detailDrug.ingredients);
                // console.log('concentration: ', item.detailDrug.concentration);
                // console.log('concenArr    : ', item.detailDrug.concentrationArr, '\n');
            }

        }
        if (name && type3Regex.test(name) && !mySet.has(item) && !name.includes(', ') && !name.includes('; ')) {
            item.detailDrug.concentrationArr = []
            splitType3(item, name)
            if (item.detailDrug.concentrationArr.length > 0) {
                mySet.add(item)
                countDrug.thirdType++
                countDrug.countedType++
                stockModels.push(item)
                // console.log('ingredients  : ', item.detailDrug.ingredients);
                // console.log('concentration: ', item.detailDrug.concentration);
                // console.log('concenArr    : ', item.detailDrug.concentrationArr, '\n');
            }
        }
        if (name && name.includes(', ') && !name.includes('; ') && !name.includes(':') && !mySet.has(item)) {
            let splitNames = name.split(/\,\s/i)
            if (splitNames) {
                item.detailDrug.concentrationArr = []
                let setCount
                splitNames.forEach((tempIngredients, index) => {
                    setCount = 0
                    tempIngredients = handleName(tempIngredients)
                    if (vitaminRegex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitVitaminType(item, tempIngredients)
                        setCount = 1
                    }
                    if (type1Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1(item, tempIngredients)
                        setCount = 1
                    }
                    if (typ1ReverseRegex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1Reverse(item, tempIngredients)
                        setCount = 1
                    }
                    if (type2Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType2(item, tempIngredients)
                        setCount = 1
                    }

                    if (type4Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType4(item, tempIngredients)
                        setCount = 1
                    }
                    if (type5Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType5(item, tempIngredients)
                        setCount = 1
                    }
                    if (type3Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType3(item, tempIngredients)
                        setCount = 1
                    }
                })
                if (setCount == 1 && item.detailDrug.concentrationArr.length > 0) {
                    stockModels.push(item)
                    item.detailDrug.concentrationArr.forEach(ingredientName => {
                        hasIngredient[ingredientName.ingredient] = 1
                    })
                    mySet.add(item)
                    // console.log('ingredients  : ', item.detailDrug.ingredients);
                    // console.log('concentration: ', item.detailDrug.concentration);
                    // console.log('concenArr    : ', item.detailDrug.concentrationArr, '\n');
                    countDrug.ninthType++
                    countDrug.countedType++
                }
            }
        }
        if (name && name.includes('; ') && !name.includes(', ') && !name.includes(':') && !mySet.has(item)) {
            let splitNames = name.split(/\;\s/i)
            if (splitNames) {
                item.detailDrug.concentrationArr = []
                let setCount
                splitNames.forEach(tempIngredients => {
                    tempIngredients = handleName(tempIngredients)
                    setCount = 0
                    if (vitaminRegex.test(tempIngredients) && !mySet.has(item)) {
                        splitVitaminType(item, tempIngredients)
                        setCount = 1
                    }
                    if (type1Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1(item, tempIngredients)
                        setCount = 1
                    }
                    if (typ1ReverseRegex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1Reverse(item, tempIngredients)
                        setCount = 1
                    }
                    if (type2Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType2(item, tempIngredients)
                        setCount = 1
                    }

                    if (type4Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType4(item, tempIngredients)
                        setCount = 1
                    }
                    if (type5Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType5(item, tempIngredients)
                        setCount = 1
                    }
                    if (type3Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType3(item, tempIngredients)
                        setCount = 1
                    }
                })
                if (setCount == 1 && item.detailDrug.concentrationArr.length > 0) {
                    stockModels.push(item)
                    item.detailDrug.concentrationArr.forEach(ingredientName => {
                        //if(!hasIngredient)
                        hasIngredient[ingredientName.ingredient] = 1
                    })
                    mySet.add(item)
                    // console.log('ingredients  : ', item.detailDrug.ingredients);
                    // console.log('concentration: ', item.detailDrug.concentration);
                    // console.log('concenArr    : ', item.detailDrug.concentrationArr);
                    countDrug.tenthType++
                    countDrug.countedType++
                }
            }
        }
        if (name && name.includes('; ') && name.includes(', ') && !mySet.has(item)) {
            let splitNames = name.split(/\;\s|\,\s/i)
            if (splitNames) {
                item.detailDrug.concentrationArr = []
                let setCount
                splitNames.forEach(tempIngredients => {
                    tempIngredients = handleName(tempIngredients)
                    setCount = 0
                    if (vitaminRegex.test(tempIngredients) && !mySet.has(item)) {
                        splitVitaminType(item, tempIngredients)
                        setCount = 1
                    }
                    if (typ1ReverseRegex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1Reverse(item, tempIngredients)
                        setCount = 1
                    }
                    if (type1Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType1(item, tempIngredients)
                        setCount = 1
                    }
                    if (type2Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType2(item, tempIngredients)
                        setCount = 1
                    }
                    if (type4Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType4(item, tempIngredients)
                        setCount = 1
                    }
                    if (type5Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType5(item, tempIngredients)
                        setCount = 1
                    }
                    if (type3Regex.test(tempIngredients) && !mySet.has(item) && setCount == 0) {
                        splitType3(item, tempIngredients)
                        setCount = 1
                    }
                })
                if (setCount == 1 && item.detailDrug.concentrationArr.length > 0) {
                    stockModels.push(item)
                    item.detailDrug.concentrationArr.forEach(ingredientName => {
                        //if(!hasIngredient)
                        hasIngredient[ingredientName.ingredient] = 1
                    })
                    mySet.add(item)
                    // console.log('ingredients  : ', item.detailDrug.ingredients);
                    // console.log('concentration: ', item.detailDrug.concentration);
                    // console.log('concenArr    : ', item.detailDrug.concentrationArr);
                    countDrug.seventhType++
                    countDrug.countedType++
                }
            }
        }
    })
    if (stockModels.length) {
        fs.writeFileSync(`./result/skip${i}.json`, JSON.stringify(stockModels), 'utf-8')
    }
}

let countRestName = 0
let uncountedModel = []
for (let i = 0; i <= 5000; i += 500) {
    let listDrug = require(`./standardDrug3Full/skip${i}`)
    listDrug.forEach((item, index) => {
        let name = (item.detailDrug.ingredients);
        // name = handleName(name)
        if (name && !mySet.has(item)) {
            uncountedModel.push(item)
            countDrug.rest++
            if (!hashName[name]) {
                hashName[name] = 1
                name = handleName(name)
                countRestName++
            }
        }
    })
}

fs.writeFileSync('./uncounted/uncountedSkip.json', JSON.stringify(uncountedModel), 'utf-8')

console.log(countDrug);
console.log('rest name:', countRestName);

