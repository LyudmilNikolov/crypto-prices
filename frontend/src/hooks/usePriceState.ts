import {useContext} from "react";
import {PriceContext} from "../context/PriceContext.tsx";

export const usePriceState = () => useContext(PriceContext);
