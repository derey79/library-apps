import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Location } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RootState } from '@/store/store';
import { removeFromCart, CartItem } from '@/store/slices/cartSlice';
import axiosInstance from '@/api/axiosInstance';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

import CheckoutBookRow from '@/features/cart/components/checkout/CheckoutBookRow';
import UserInformation from '@/features/cart/components/checkout/UserInformation';
import CompleteRequestForm from '@/features/cart/components/checkout/CompleteRequestForm';
import BorrowSuccessModal from '@/features/cart/components/checkout/BorrowSuccessModal';
import { SingleLoanPayload, ApiErrorData } from '@/types/types';

interface RouterLocationState {
  checkoutItems?: CartItem[];
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const location = useLocation() as Location<RouterLocationState>;

  const { token, user } = useSelector((state: RootState) => state.auth);
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const checkoutItems: CartItem[] =
    location.state?.checkoutItems && location.state.checkoutItems.length > 0
      ? location.state.checkoutItems
      : cartItems;

  const [borrowDuration, setBorrowDuration] = useState<number>(3);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [agreePolicy, setAgreePolicy] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isStagingReady, setIsStagingReady] = useState<boolean>(false);

  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStagingReady(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isStagingReady && !isCheckoutSuccess && checkoutItems.length === 0) {
      toast.error(
        'Your checkout environment is vacant. Redirecting to cart...'
      );
      navigate('/cart');
    }
  }, [checkoutItems.length, navigate, isStagingReady, isCheckoutSuccess]);

  const today: Date = new Date();
  const returnDate: Date = new Date();
  returnDate.setDate(today.getDate() + borrowDuration);
  const targetReturnString: string = returnDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // PARALEL MUTATION REQUEST via Promise.all
  const checkoutMutation = useMutation<
    unknown,
    AxiosError<ApiErrorData>,
    SingleLoanPayload[]
  >({
    mutationFn: async (payloadArray: SingleLoanPayload[]) => {
      const loanPromises = payloadArray.map((payload: SingleLoanPayload) =>
        axiosInstance.post(`/loans`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );
      return Promise.all(loanPromises);
    },
    onSuccess: () => {
      setIsCheckoutSuccess(true);

      // Hapus seluruh buku yang sukses dipinjam dari keranjang belanja
      checkoutItems.forEach((item: CartItem) =>
        dispatch(removeFromCart(item.id))
      );

      // 💡 SINKRONISASI STOK REAKTIF: Paksa TanStack Query memperbarui sisa stok buku dari server
      queryClient.invalidateQueries({ queryKey: ['publicCatalogBooks'] }); // Update grid katalog publik
      queryClient.invalidateQueries({ queryKey: ['bookDetail'] }); // Update detail buku individu
      queryClient.invalidateQueries({ queryKey: ['adminBooksManagement'] }); // Update list inventaris buku admin

      queryClient.invalidateQueries({ queryKey: ['myLoansHistory'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });

      // Luncurkan jendela pop-up sukses minimalis Figma
      setIsSuccessModalOpen(true);
    },
    onError: (error: AxiosError<ApiErrorData>) => {
      const errorMessage: string =
        error.response?.data?.message || 'Failed to confirm loan request.';
      toast.error(errorMessage);
    },
  });

  const handleFinalRedirect = (): void => {
    setIsSuccessModalOpen(false);
    navigate('/profile?tab=borrowed');
  };

  const handleConfirmBorrow = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!agreeTerms || !agreePolicy) {
      toast.error('Please accept all borrowing terms and compliance policies.');
      return;
    }

    const finalPayloadArray: SingleLoanPayload[] = checkoutItems.map(
      (item: CartItem) => ({
        bookId: item.id,
        days: borrowDuration,
      })
    );

    checkoutMutation.mutate(finalPayloadArray);
  };

  if (!isStagingReady) {
    return (
      <div className='py-44 text-center space-y-3 max-w-sm mx-auto animate-fade-in text-neutral-400'>
        <Loader2 className='h-6 w-6 text-blue-500 animate-spin mx-auto' />
        <p className='text-xs font-semibold'>
          Aligning transactional credentials...
        </p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-5xl mx-auto space-y-6 text-neutral-800 animate-fade-in pb-16 px-4 md:px-6 text-left relative'>
      {/* HEADER PAGE */}
      <div className='border-b border-neutral-100 pb-3'>
        <button
          onClick={() => navigate('/cart')}
          className='inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition mb-2 focus:outline-none'
        >
          <ArrowLeft className='h-3.5 w-3.5' /> Back to Cart Workspace
        </button>
        <h1 className='text-3xl font-extrabold text-neutral-950 tracking-tight'>
          Checkout
        </h1>
      </div>

      <div className='flex flex-col md:flex-row gap-8 items-start'>
        {/* KOLOM KIRI: USER DETAILS & BOOK LIST */}
        <div className='flex-1 w-full space-y-8'>
          <UserInformation user={user} />
          <div className='space-y-3 pt-2'>
            <h2 className='text-lg font-extrabold text-neutral-950 tracking-tight'>
              Book List
            </h2>
            <div className='divide-y divide-neutral-100 border-t border-neutral-100'>
              {checkoutItems.map((item: CartItem) => (
                <CheckoutBookRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FORM SELEKSI DURASI */}
        <CompleteRequestForm
          borrowDuration={borrowDuration}
          agreeTerms={agreeTerms}
          agreePolicy={agreePolicy}
          isPending={checkoutMutation.isPending}
          onDurationChange={setBorrowDuration}
          onAgreeTermsChange={setAgreeTerms}
          onAgreePolicyChange={setAgreePolicy}
          onSubmit={handleConfirmBorrow}
        />
      </div>

      {/* MODAL TRANZITION SUCCESS POPUP FIGMA */}
      <BorrowSuccessModal
        isOpen={isSuccessModalOpen}
        returnDateString={targetReturnString}
        onNavigateToList={handleFinalRedirect}
      />
    </div>
  );
}
