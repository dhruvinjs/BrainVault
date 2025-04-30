import { ReactElement } from "react";

interface SideBarItemsProps{
    icon:ReactElement;
    text:string,
    onClick?:()=>void,
    className?:string | ""
}
const defaultStyles="transition-all duration-200 ease-in-out hover:bg-purple-500"
export function SideBarItems({icon,text,onClick,className}:SideBarItemsProps){
    return <div className={`flex cursor-pointer pl-4 m-w-52 rounded items-center ${className} ${defaultStyles}`} onClick={onClick}>
        <div className={`p-2 ${className} `}>{icon} </div>
        <div className={`p-2 ${className} `}>{text}</div>
    </div>
}