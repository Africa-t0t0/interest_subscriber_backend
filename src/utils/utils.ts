export const getInteresectionOfArrays = (array1: any[], array2: any[]) => {
    return array1.filter((value) => array2.includes(value));
};