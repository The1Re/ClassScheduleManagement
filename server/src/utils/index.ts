function incrementId(id: string) {
    const numbericPart = id.substring(1);
    const number = parseInt(numbericPart, 10);
    return id.charAt(0) + (number+1).toString().padStart(numbericPart.length, '0')
}

export {
    incrementId
}