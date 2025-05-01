// "use client";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "./ui/accordion";
// import { Alert, AlertDescription } from "./ui/alert";

// interface ToiletDataFormat {
//   id: number;
//   name: string;
//   latitude: number;
//   longitude: number;
//   is_male: boolean;
//   is_female: boolean;
//   is_accessible: boolean;
//   is_open: boolean;
//   cleaniness_rating: number;
//   description: string;
//   opening_time?: string;
//   closing_time?: string;
//   open_saturday?: boolean;
//   open_sunday?: boolean;
//   distance?: number;
// }

// function StatusLabel(status: boolean) {
//   return (
//     <div
//       className={`rounded-lg px-2 py-1 text-sm w-[fit-content] ${
//         status ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
//       } font-bold px-2`}
//     >
//       {status ? "Open" : "Closed"}
//     </div>
//   );
// }

// function StatusIndicator(status: boolean, accessible: boolean) {
//   return (
//     <div
//       className={`h-2 w-2 rounded-full
//             ${!status && "bg-red-400"}
//             ${status && accessible && "bg-green-400"}
//             ${status && !accessible && "bg-amber-400"}
//         `}
//     ></div>
//   );
// }

// export default function Left({
//   data,
//   activeBuilding,
//   setActiveBuilding,
// }: {
//   data: ToiletDataFormat[];
//   activeBuilding: string;
//   setActiveBuilding: (building: string) => void;
// }) {
//   // Check if data is an array, if not, use an empty array
//   const toiletsArray = Array.isArray(data) ? data : [];

//   if (toiletsArray.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Alert className="mx-auto w-fit text-center">
//           <AlertDescription>No toilets available</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="px-8">
//       <Accordion
//         type="single"
//         collapsible
//         className="w-full"
//         value={activeBuilding || ""}
//         onValueChange={(value) => setActiveBuilding(value)}
//       >
//         {toiletsArray.map((toilet) => (
//           <AccordionItem
//             key={toilet.id}
//             id={toilet.id.toString()}
//             value={toilet.name}
//           >
//             <AccordionTrigger>
//               <div className="flex justify-between w-[95%] text-left text-lg group cursor-pointer items-center">
//                 <div className=" hover:underline text-white ">
//                   {toilet.name}
//                 </div>
//                 <div>{StatusLabel(toilet.is_open)}</div>
//               </div>
//             </AccordionTrigger>
//             <AccordionContent className="divide-y didvide-dashed">
//               <div className="py-2">
//                 <div className="flex gap-4 items-center mb-2">
//                   <div className="relative">
//                     {StatusIndicator(toilet.is_open, toilet.is_accessible)}
//                   </div>
//                   <div className="font-medium text-white">
//                     Cleanliness: {toilet.cleaniness_rating.toFixed(1)}/5
//                   </div>
//                 </div>

//                 <div className="text-sm text-white mb-2">
//                   {toilet.opening_time && toilet.closing_time ? (
//                     <span>
//                       {toilet.opening_time} - {toilet.closing_time}
//                     </span>
//                   ) : (
//                     <span>Opening and Closing times not available</span>
//                   )}
//                 </div>
//                 <div className="text-sm text-white mb-2">
//                   {toilet.open_saturday && toilet.open_sunday ? (
//                     <span>Open on weekends</span>
//                   ) : (
//                     <span>Closed on weekends</span>
//                   )}
//                 </div>

//                 <div className="flex flex-wrap gap-2 mb-2">
//                   {toilet.is_male && (
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       Male
//                     </span>
//                   )}
//                   {toilet.is_female && (
//                     <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       Female
//                     </span>
//                   )}
//                   {toilet.is_accessible && (
//                     <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                       Accessible
//                     </span>
//                   )}
//                 </div>
//                 {toilet.distance && (
//                   <div className="text-sm text-gray-400 mb-2">
//                     Distance: {toilet.distance.toFixed(2)} km
//                   </div>
//                 )}
//                 <p className="text-sm text-gray-300 mt-2">
//                   {toilet.description}
//                 </p>
//               </div>
//             </AccordionContent>
//           </AccordionItem>
//         ))}
//       </Accordion>
//     </div>
//   );
// }

"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Alert, AlertDescription } from "./ui/alert";
import { isToiletOpen } from "./isToiletOpenUtility";

interface ToiletDataFormat {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  is_male: boolean;
  is_female: boolean;
  is_accessible: boolean;
  is_open: boolean; // We'll keep this in the interface but ignore it
  cleaniness_rating: number;
  description: string;
  opening_time?: string;
  closing_time?: string;
  open_monday?: boolean;
  open_tuesday?: boolean;
  open_wednesday?: boolean;
  open_thursday?: boolean;
  open_friday?: boolean;
  open_saturday?: boolean;
  open_sunday?: boolean;
  distance?: number;
}

function StatusLabel(toilet: ToiletDataFormat) {
  const isOpen = isToiletOpen(toilet);
  return (
    <div
      className={`rounded-lg px-2 py-1 text-sm w-[fit-content] ${
        isOpen ? "bg-green-500 text-green-50" : "bg-red-500 text-red-50"
      } font-bold px-2`}
    >
      {isOpen ? "Open" : "Closed"}
    </div>
  );
}

function StatusIndicator(toilet: ToiletDataFormat) {
  const isOpen = isToiletOpen(toilet);
  return (
    <div
      className={`h-2 w-2 rounded-full 
            ${!isOpen && "bg-red-400"}
            ${isOpen && toilet.is_accessible && "bg-green-400"}
            ${isOpen && !toilet.is_accessible && "bg-amber-400"}
        `}
    ></div>
  );
}

export default function Left({
  data,
  activeBuilding,
  setActiveBuilding,
}: {
  data: ToiletDataFormat[];
  activeBuilding: string;
  setActiveBuilding: (building: string) => void;
}) {
  // Check if data is an array, if not, use an empty array
  const toiletsArray = Array.isArray(data) ? data : [];

  if (toiletsArray.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Alert className="mx-auto w-fit text-center">
          <AlertDescription>No toilets available</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="px-8">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={activeBuilding || ""}
        onValueChange={(value) => setActiveBuilding(value)}
      >
        {toiletsArray.map((toilet) => (
          <AccordionItem
            key={toilet.id}
            id={toilet.id.toString()}
            value={toilet.name}
          >
            <AccordionTrigger>
              <div className="flex justify-between w-[95%] text-left text-lg group cursor-pointer items-center">
                <div className=" hover:underline text-white ">
                  {toilet.name}
                </div>
                <div>{StatusLabel(toilet)}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="divide-y didvide-dashed">
              <div className="py-2">
                <div className="flex gap-4 items-center mb-2">
                  <div className="relative">{StatusIndicator(toilet)}</div>
                  <div className="font-medium text-white">
                    Cleanliness: {toilet.cleaniness_rating.toFixed(1)}/5
                  </div>
                </div>

                <div className="text-sm text-white mb-2">
                  {toilet.opening_time && toilet.closing_time ? (
                    <span>
                      {toilet.opening_time} - {toilet.closing_time}
                    </span>
                  ) : (
                    <span>Opening and Closing times not available</span>
                  )}
                </div>
                <div className="text-sm text-white mb-2">
                  {toilet.open_saturday && toilet.open_sunday ? (
                    <span>Open on weekends</span>
                  ) : (
                    <span>Closed on weekends</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {toilet.is_male && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Male
                    </span>
                  )}
                  {toilet.is_female && (
                    <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Female
                    </span>
                  )}
                  {toilet.is_accessible && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Accessible
                    </span>
                  )}
                </div>
                {toilet.distance && (
                  <div className="text-sm text-gray-400 mb-2">
                    Distance: {toilet.distance.toFixed(2)} km
                  </div>
                )}
                <p className="text-sm text-gray-300 mt-2">
                  {toilet.description}
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
