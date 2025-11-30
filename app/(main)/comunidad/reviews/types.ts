export interface BaseReview {
  rating: number;
  comment: string;
}
export interface ReviewFormData extends BaseReview {
  community_id: string;
}
export interface ReviewFormState extends BaseReview {
  setComment: (comment: string) => void;
  setRating: (rating: number) => void;
  reset: () => void;
}
export interface ReviewToSend extends BaseReview, ReviewFormData {
  id: string;
  user_id: string;
}

export interface DbReviewResponse extends ReviewToSend {
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    avatar_url: string | null;
  };
}
export interface communityFullReview {
  average_rating: number;
  total_reviews: number;
  comments: DbReviewResponse[];
}
