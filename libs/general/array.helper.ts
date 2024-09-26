import { typesHelper } from ".";

export class ArrayHelpers {
    static instance: ArrayHelpers;

    constructor() {
        if(!ArrayHelpers.instance) ArrayHelpers.instance = this;
        return ArrayHelpers.instance
    }

    static getInstance = () => {
        return ArrayHelpers.instance;
    }

    /**
     * *********************** helpers **************************
     */

    /**
     * @param arr array of object
     * @param key key for mapping the array of objects to hash table (type for key for mapping object must be string or number)
     * @returns the mapped object of array of objects according to given key property
     */
    transformArray = <Type>(arr: Type[], key: keyof Type) => {
        typesHelper.isThereNullishValues(...arr);
        typesHelper.isThereNullishValues(key);
        const obj:any = {};
        for(const item of arr) {
            typesHelper.hasProperty(item, key);
            obj[item[key]] = item
        }

        return obj;
    }
}