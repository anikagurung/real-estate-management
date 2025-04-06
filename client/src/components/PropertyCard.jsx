import { Link } from 'react-router-dom';

export default function PropertyCard({ id, title, location, price, image }) {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-500">{location}</p>
        <p className="text-lg font-bold mt-2">Rs. {price}</p>
        <Link to={`/property/${id}`}>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
