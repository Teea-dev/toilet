// Create a ToiletDetail.tsx component



interface ToiletDataFormat {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    is_male: boolean;
    is_female: boolean;
    is_accessible: boolean;
    is_open: boolean;
    cleaniness_rating: number;
    description: string;
    distance?: number;
  }


  
interface ToiletDetailProps {
    toilet: ToiletDataFormat | null;
    onClose: () => void;
  }
  
  export default function ToiletDetail({ toilet, onClose }: ToiletDetailProps) {
    if (!toilet) return null;
  
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
          <h2 className="text-xl font-bold mb-2">{toilet.name}</h2>
          
          <div className="mb-4 text-sm">
            {toilet.distance !== undefined && (
              <p className="text-blue-600 font-medium">
                {toilet.distance < 1 
                  ? `${Math.round(toilet.distance * 1000)}m away` 
                  : `${toilet.distance.toFixed(1)}km away`}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className={`p-2 rounded ${toilet.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {toilet.is_open ? 'Open' : 'Closed'}
            </div>
            <div className={`p-2 rounded ${toilet.is_accessible ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
              {toilet.is_accessible ? 'Accessible' : 'Not Accessible'}
            </div>
            <div className={`p-2 rounded ${toilet.is_male ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {toilet.is_male ? 'Male Facilities' : 'No Male'}
            </div>
            <div className={`p-2 rounded ${toilet.is_female ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'}`}>
              {toilet.is_female ? 'Female Facilities' : 'No Female'}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-1">Cleanliness Rating</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg 
                  key={star}
                  className={`w-5 h-5 ${star <= toilet.cleaniness_rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-gray-600">({toilet.cleaniness_rating.toFixed(1)})</span>
            </div>
          </div>
          
          {toilet.description && (
            <div className="mb-4">
              <h3 className="font-medium mb-1">Description</h3>
              <p className="text-gray-700">{toilet.description}</p>
            </div>
          )}
          
          <div className="flex justify-end">
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }