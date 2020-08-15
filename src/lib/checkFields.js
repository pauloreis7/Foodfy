function checkAllFields(body) {
    const keys = Object.keys(body)

    for( key of keys ) {

        if (body[key] == "") {
            return {
                error: "Por favor preencha todo os campos!!",
                user: body
            }
        }
    }
}

module.exports = checkAllFields