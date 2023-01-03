const isValidPhone = function (number) {
    let regexPhone = /^[6-9]\d{9}$/
    return regexPhone.test(number)
}

const isValidBody = function (object) {
    return Object.keys(object).length > 0;
}

const isValidString = (Name) => {
    return /\d/.test(Name)
}

const isValidAge = function (age) {
    let regexAge = /^(1[0-5]|[1-9])$/
    return regexAge.test(age)

}

const isValidPincode = function (pincode) {
    let regexPin = /^[0-9]{6}$/
    return regexPin.test(pincode)
}

const isValidAadharNo = function (aadharno) {
    let regexAadharNo = /^[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}$/
    return regexAadharNo.test(aadharno)
}

const isValidPassword = function (Password) {
    let regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
    return regexPassword.test(Password)
}
const isvalidSlot = function (slot) {
    return [10, 10.30, 11, 11.30, 12, 12.30, 1, 1.30, 2, 2.30, 3, 3.30, 4, 4.30].includes(slot);
};

const isValidDose = (Dose) => {
    let verify = ["none", "first", "second"]
    if (verify.includes(Dose)) {
        return true
    } else {
        return false
    }
}

module.exports = { isValidPhone, isValidString, isValidAge, isValidPincode, isValidAadharNo, isValidPassword, isValidDose, isValidBody, isvalidSlot }