class User {
    constructor() {
        console.log("User Class working");
        this.doThis();
    }

    doThis() {
        setInterval(() => {
            console.log("this is doing");
        }, 2000);
    }
}

module.exports = new User();
