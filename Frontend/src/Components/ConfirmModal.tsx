import { X } from "lucide-react";
import { Button } from "./Button";


export function ConfirmModal({open,setOpen,onConfirm}:{open:boolean,setOpen:(open:boolean)=>void,
    onConfirm:()=>void
}){

   if(!open) return null
   
   return(
    <>
   <div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
         <div className="bg-white rounded-lg shadow-lg w-[300px] p-6 relative">
            <div className="flex justify-end">
            <X size={18} onClick={()=>setOpen(!open)}/>
            </div>


            <h2 className="text-xl font-semibold mb-4">Confirm Delete Content</h2>
            <p className="text-gray-600 mb-6">Are you sure you want to delete</p>
            <div className="flex flex-row gap-4 justify-center">
                
            <Button
            variant="secondary"
            size="sm"
            text="Close"
            onClick={()=>setOpen(!open)}
            />

            <Button
            variant="danger"
            size="sm"
            text="Delete"
            onClick={onConfirm}
            />
            </div>
         </div>
    </div>
            </>
    )
}