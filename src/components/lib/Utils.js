export const getISTDate = (dateString) => {
    let date = new Date(dateString);
    // let offset = 330; // IST offset in minutes
    // let istDate = new Date(date.getTime() + offset * 60000);
    return date;
}
