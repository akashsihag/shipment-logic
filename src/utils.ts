import {ContainerSpec} from "./interfaces";

export class Utils {
    public static getVolume(l: number, b: number, h: number) {
        return l*b*h
    }

    public static validatePackage(container: [number, number, number], product: [number, number, number]) {
        if(container[0] >= product[0] && container[1] >= product[1] && container[2] >= product[2]){
            return true
        }
        return false;
    }

}