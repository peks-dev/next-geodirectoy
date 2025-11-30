import { create } from 'zustand';
import type { ReviewFormState } from '../../types';

export const useRatingFormStore = create<ReviewFormState>((set) => ({
  comment: '',
  rating: 0,
  setComment: (comment) => set({ comment }),
  setRating: (rating) => set({ rating }),
  reset: () => set({ comment: '', rating: 0 }),
}));
