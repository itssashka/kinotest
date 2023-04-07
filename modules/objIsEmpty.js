export default function objIsEmpty(obj) {
    const isEmpty = Object.keys(obj).length === 0;
    return isEmpty;
}