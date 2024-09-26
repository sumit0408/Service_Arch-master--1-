import { ERROR_MESSAGES } from "../../constants/error-messages";
import { JS_TYPES } from "../../constants";
import { MixedTypeArray } from "../../types";

export class TypesHelper {
    static instance: TypesHelper;

    constructor() {
        if(!TypesHelper.instance) TypesHelper.instance = this;
        return TypesHelper.instance
    }

    static getInstance = () => {
        return TypesHelper.instance;
    }

    /**
    * *********************** helpers **************************
    */

    /**
     * @param items list of different types of items
     * @throws {Error} if any of item from list is null, undef or empty then it throws nullish argument error
     */
   isThereNullishValues = <Type>(...items: Type[]) => {
        if(!items) throw new Error(ERROR_MESSAGES.UNDEF_NULL_ARGUMENT);
        const nullFilteredItem  = items.filter(item => item === null || item === undefined || item === "");
        if(nullFilteredItem.length) throw new Error(ERROR_MESSAGES.NULLISH_ARGUMENTS);
        return false;
   }

   /**
    * @param obj 
    * @param key 
    * @throws {Error} if any of item from list is null then it throws undefined property
    */
   hasProperty = <T>(obj: T, key: keyof T) => {
        if(obj[key] === JS_TYPES.undefined) throw new Error(ERROR_MESSAGES.UNDEF_PROPERTY)
        return true;
   }

   /**
    * @param arg
    * @returns string as type of argument
    */
   type = <T>(arg: T) => typeof arg;

}