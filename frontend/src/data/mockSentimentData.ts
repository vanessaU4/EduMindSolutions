import { Review } from "@/features/products/productSlice";

export interface PaginatedReviews {
  reviews: Review[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalReviews: number;
  };
}

const mockReviews: Review[] = [
  {
    id: "rev-001",
    text: "Amazing sound quality and very comfortable!",
    sentiment: "positive",
    rating: 5,
    date: "2025-06-14T10:00:00Z",
    userName: "Jane Doe",
  },
  {
    id: "rev-002",
    text: "The battery life is not great.",
    sentiment: "negative",
    rating: 2,
    date: "2025-06-13T15:30:00Z",
    userName: "John Smith",
  },
  {
    id: "rev-003",
    text: "It's an okay product, does the job.",
    sentiment: "neutral",
    rating: 3,
    date: "2025-06-13T12:00:00Z",
    userName: "Peter Jones",
  },
  {
    id: "rev-004",
    text: "I love it! Best purchase this year!",
    sentiment: "positive",
    rating: 5,
    date: "2025-06-12T18:45:00Z",
    userName: "Alice Williams",
  },
  {
    id: "rev-005",
    text: "Broke after a week. Very disappointed.",
    sentiment: "negative",
    rating: 1,
    date: "2025-06-11T09:20:00Z",
    userName: "David Brown",
  },
  {
    id: "rev-006",
    text: "Good value for the price.",
    sentiment: "positive",
    rating: 4,
    date: "2025-06-10T14:00:00Z",
    userName: "Emily Davis",
  },
  {
    id: "rev-007",
    text: "The user interface is a bit confusing.",
    sentiment: "neutral",
    rating: 3,
    date: "2025-06-09T11:55:00Z",
    userName: "Michael Miller",
  },
  {
    id: "rev-008",
    text: "Customer support was not helpful.",
    sentiment: "negative",
    rating: 2,
    date: "2025-06-08T16:10:00Z",
    userName: "Sarah Wilson",
  },
  {
    id: "rev-009",
    text: "Exceeded my expectations!",
    sentiment: "positive",
    rating: 5,
    date: "2025-06-07T20:00:00Z",
    userName: "Chris Taylor",
  },
  {
    id: "rev-010",
    text: "It's fine, nothing special.",
    sentiment: "neutral",
    rating: 3,
    date: "2025-06-06T13:30:00Z",
    userName: "Jessica Anderson",
  },
];

export const fetchSentimentOverview = async () => {
  // This could be replaced with a real API call in the future
  // For now, keeping the mock data structure
  return Promise.resolve({
    totalReviews: 1250,
    averageSentiment: 4.1,
    sentimentDistribution: {
      positive: 800,
      neutral: 300,
      negative: 150,
    },
  });
};

export const fetchReviews = async (
  page = 1,
  limit = 10,
  filters: { sentiment: string; search: string }
): Promise<PaginatedReviews> => {
  let filteredReviews = mockReviews;

  if (filters.sentiment && filters.sentiment !== "all") {
    filteredReviews = filteredReviews.filter(
      (r) => r.sentiment === filters.sentiment
    );
  }

  if (filters.search) {
    filteredReviews = filteredReviews.filter((r) =>
      r.text.toLowerCase().includes(filters.search.toLowerCase())
    );
  }

  const totalReviews = filteredReviews.length;
  const totalPages = Math.ceil(totalReviews / limit);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * limit,
    page * limit
  );

  return Promise.resolve({
    reviews: paginatedReviews.map((r) => ({
      ...r,
      productId: `prod-${Math.ceil(Math.random() * 5)}`,
      productName: "Sample Product",
    })),
    pagination: {
      currentPage: page,
      totalPages: totalPages,
      totalReviews: totalReviews,
    },
  });
};
