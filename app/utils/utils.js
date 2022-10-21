module.exports = {
    checkemail: (str) => {
        var filter = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
        if (filter.test(str))
            testresults = true
        else {
            testresults = false
        }
        return (testresults)
    },
    isEmpty: (str) => {
        if (str == null || str == undefined) {
            return true;
        }
        if (typeof str == "object") {
            for (var prop in str) {
                if (str.hasOwnProperty(prop))
                    return false;
            }
            return true;
        } else {
            return /^\s*$/.test(str);
        }
    }
};