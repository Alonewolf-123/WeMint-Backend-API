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
    },
    withoutTime: (date) => {
        var d = new Date(date);
        d.setHours(0, 0, 0, 0);
        console.log(date);
        console.log(d);
        return d.toISOString().slice(0, 10);
    }

};