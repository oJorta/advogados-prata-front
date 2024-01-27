import { trash } from "@/types/trash";

export function isEmptyObj(obj: trash) {
    return Object.keys(obj).length === 0;
}