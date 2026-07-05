// profile //
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export interface ProfileFormFieldsProps {
  name: string;
  phone: string;
  email: string;
  role: string;
  isPending: boolean;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

// loans stat //
interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

export interface MeApiResponse {
  success: boolean;
  message: string;
  data: {
    profile: UserProfile;
    loanStats: LoanStats;
    reviewsCount: number;
  };
}

export interface BookGridHeaderProps {
  isFiltered: boolean;
  totalBooks: number;
}

// loan books //
export interface SharedLoanNode {
  id: number;
  bookId: number;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  displayStatus: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
  durationDays: number;
  book: {
    id: number;
    title: string;
    coverImage: string;
    author: { name: string };
    category?: { name: string };
  };
  borrower?: {
    name: string;
    email: string;
  };
}

export interface LoanItemCardProps {
  loan: SharedLoanNode;
  variant: 'USER' | 'ADMIN';
}

export interface UserLoansApiResponse {
  data: {
    loans: SharedLoanNode[];
    pagination: {
      totalPages: number;
      currentPage: number;
    };
  };
}

export interface LoanRecord {
  id: number;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  book: {
    title: string;
    coverImage: string;
    author: { name: string };
  };
}

export interface LoanRowProps {
  record: LoanRecord;
}

export interface LoansApiResponse {
  success: boolean;
  message: string;
  data: {
    loans: LoanRecord[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface SingleLoanPayload {
  bookId: number;
  days: number;
}

interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

export interface ProfileStatsCardsProps {
  stats?: LoanStats;
}

// review //
export interface ReviewBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: number;
  bookTitle: string;
}

export interface ReviewPayload {
  bookId: number;
  star: number;
  comment?: string;
  review?: string;
  content?: string;
}

export interface AdminLoansApiResponse {
  data: {
    loans: SharedLoanNode[];
    pagination: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

// error
export interface ApiErrorData {
  message?: string;
}
