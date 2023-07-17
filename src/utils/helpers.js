const timestampToDate = (timestamp) => new Date(timestamp)
    .toLocaleString('en-GB', { hour12: false, })
    .replace(',', ' -')

export {
    timestampToDate,
}