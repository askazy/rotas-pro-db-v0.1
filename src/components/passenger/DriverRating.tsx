import React, { useState } from 'react';
import Button from '../ui/Button';
import { rateDriver } from '../../lib/ratingService';

interface DriverRatingProps {
  rideId: string;
  driverName: string;
  onRatingComplete?: () => void;
}

const DriverRating: React.FC<DriverRatingProps> = ({ 
  rideId, 
  driverName,
  onRatingComplete 
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await rateDriver(rideId, rating, comment);
      setSubmitted(true);
      if (onRatingComplete) {
        onRatingComplete();
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <span className="material-symbols-outlined text-green-500 text-3xl">check_circle</span>
        <p className="text-green-800 mt-2">Obrigado pela sua avaliação!</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Avalie sua viagem com {driverName}</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="text-3xl focus:outline-none px-1"
            >
              <span className="material-symbols-outlined" style={{ 
                color: (hoveredRating || rating) >= star ? '#FBBF24' : '#D1D5DB',
                fontVariationSettings: "'FILL' 1"
              }}>
                star
              </span>
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comentário (opcional)
          </label>
          <textarea
            id="comment"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Conte-nos sobre sua experiência..."
          />
        </div>
        
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
          disabled={rating === 0}
        >
          Enviar Avaliação
        </Button>
      </form>
    </div>
  );
};

export default DriverRating;
