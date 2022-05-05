export const province = (province) => {
    switch (province) {
        case 'Surigao del Norte':
            return 'Surigao DN'

        case 'Surigao del Sur':
            return 'Surigao DS'

        case 'Agusan del Norte':
            return 'Agusan DN'

        case 'Aggusan del Sur':
            return 'Agusan DS'

        case 'Dinagat Islands':
            return 'Dinagat'
        case 'Butuan':
            return 'Butuan'
        default:
            return province
    }
}

export const money = (amount) => {
    return amount?.toLocaleString()
}

export const roomRating = (reservations) => {
    let sum = 0;
    reservations?.forEach((reservation) => {
        sum += reservation?.Review?.rating || 0
    });

    /**
     * For getting the length to get the average of the rating, we need to exclude empty Reviews.
     * We use filter for that where we return Reviews that aren't empty.
     * Read more: https://stackoverflow.com/questions/48022088/how-ignore-empty-array-elements-for-length-calculation - Kyle Baker
     */
    const count = reservations?.filter(reservation => reservation.Review).length

    /**
     * sum returns NaN if null, we need it to be 0. Check link below to convert falsey values to 0
     * https://stackoverflow.com/questions/7540397/convert-nan-to-0-in-javascript
     */
    return sum / count || 0;
}

export const reviewCount = (reservations) => {

    /**
     * For getting the length to get the average of the rating, we need to exclude empty Reviews.
     * We use filter for that where we return Reviews that aren't empty.
     * Read more: https://stackoverflow.com/questions/48022088/how-ignore-empty-array-elements-for-length-calculation - Kyle Baker
     */
    const count = reservations?.filter(reservation => reservation.Review).length
    return count || 0;
}

export const hasTokenExpired = (user) => {
    if (user) {
        const { time_stamp, expire_time, token } = user;
        if (!token || !time_stamp) {
            return false
        }
        const millisecondsElapsed = Date.now() - Number(time_stamp); // Get the elapsed time by subtracting the current timestamp to the timestamp that the accessToken has been created on the localStorage.
        return (millisecondsElapsed) > Number(expire_time)    // Convert the elapse milisec to sec and compare to the expireTime (3600 sec)
    }
}