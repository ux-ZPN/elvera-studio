import React, { useState } from 'react';
import { X, Star, Camera } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const AddReviewModal = ({ 
  isOpen, 
  onClose, 
  productHandle, 
  productTitle, 
  userSession, 
  onSuccess,
  isVerified = false 
}) => {
  const [ratingInput, setRatingInput] = useState(0);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  if (!isOpen) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userSession) return;

    const form = e.target;
    const rating = ratingInput;
    const comment = form.comment.value;
    const files = form.images.files;

    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setSubmissionLoading(true);
    try {
      let imageUrls = [];
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `${productHandle}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('review-images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('review-images')
            .getPublicUrl(filePath);
            
          imageUrls.push(publicUrl);
        }
      }

      const { error: insertError } = await supabase
        .from('reviews')
        .insert([{
          product_handle: productHandle,
          user_email: userSession.user.email,
          user_name: userSession.user.user_metadata?.full_name || userSession.user.email.split('@')[0],
          rating,
          comment,
          images: imageUrls,
          is_verified_purchase: isVerified
        }]);

      if (insertError) throw insertError;

      alert("Review submitted successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Error submitting review. Please ensure you have created the 'review-images' bucket in Supabase Storage and the 'reviews' table.");
    } finally {
      setSubmissionLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content review-form-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={24} /></button>
        <h3>Write a Review</h3>
        <p>Share your experience with <strong>{productTitle}</strong></p>
        
        <form onSubmit={handleReviewSubmit}>
           <div className="star-input-row">
              {[1,2,3,4,5].map(num => (
                <button 
                  key={num} 
                  type="button"
                  className={`star-input-btn ${ratingInput >= num ? 'active' : ''}`}
                  onClick={() => setRatingInput(num)}
                >
                  <Star size={32} fill={ratingInput >= num ? "currentColor" : "none"} />
                </button>
              ))}
           </div>

           <textarea 
             id="review-comment"
             name="comment" 
             placeholder="What did you like or dislike? How was the fit?"
             className="review-textarea"
             required
           ></textarea>

           <div className="image-upload-area" onClick={() => document.getElementById('review-img-upload').click()}>
              <Camera size={32} style={{ marginBottom: '10px', color: '#666' }} />
              <p>Add Photos</p>
              <p style={{ fontSize: '0.75rem', color: '#999' }}>Optional: Show us how it looks on you!</p>
              <input 
                id="review-img-upload"
                type="file" 
                name="images" 
                multiple 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
           </div>

           <button type="submit" className="btn-submit-review" disabled={submissionLoading}>
              {submissionLoading ? "Submitting..." : "Submit Review"}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;
