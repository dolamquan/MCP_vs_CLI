import { SavingsResult } from "../types/comparison.types";

export const calculateSavings = (
    higherCost: number,
    lowerCost: number
): SavingsResult => {
    if (higherCost <= 0) {
        return {
            amountSaved: 0,
            percentageSaved: 0
        };  
    }

    const percentageSaved = ((higherCost - lowerCost) / higherCost) * 100;
    const amountSaved = higherCost - lowerCost;
    const result: SavingsResult = {
        amountSaved: amountSaved,
        percentageSaved: percentageSaved
    };
    return result;
};
