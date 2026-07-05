import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';

interface CompleteRequestFormProps {
  borrowDuration: number;
  agreeTerms: boolean;
  agreePolicy: boolean;
  isPending: boolean;
  onDurationChange: (days: number) => void;
  onAgreeTermsChange: (checked: boolean) => void;
  onAgreePolicyChange: (checked: boolean) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; // 💡 Menolak tipe 'any' pada cetakan event form
}

export default function CompleteRequestForm({
  borrowDuration,
  agreeTerms,
  agreePolicy,
  isPending,
  onDurationChange,
  onAgreeTermsChange,
  onAgreePolicyChange,
  onSubmit,
}: CompleteRequestFormProps) {
  const today: Date = new Date();
  const returnDate: Date = new Date();
  returnDate.setDate(today.getDate() + borrowDuration);

  const formatDateDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // 💡 PERBAIKAN: Mengisi array opsi durasi hari peminjaman secara eksplisit (Type-Safe)
  const durationOptions: number[] = [3, 5, 10];

  return (
    <div className='w-full md:w-96 bg-white border border-neutral-100 rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.01)] space-y-6 shrink-0 md:sticky md:top-24'>
      <h2 className='text-md font-extrabold text-neutral-950 tracking-tight'>
        Complete Your Borrow Request
      </h2>

      <form onSubmit={onSubmit} className='space-y-5'>
        {/* BORROW DATE DROPDOWN FIELD */}
        <div className='space-y-2'>
          <label className='text-xs font-bold text-neutral-900 tracking-tight'>
            Borrow Date
          </label>
          <div className='w-full h-11 border border-neutral-200 rounded-xl px-4 flex items-center justify-between text-sm bg-neutral-50/50 font-bold text-neutral-800 shadow-sm select-none'>
            <span>{formatDateDisplay(today)}</span>
            <CalendarIcon className='h-4 w-4 text-neutral-400' />
          </div>
        </div>

        {/* RADIO CONTROLS: DURASI PEMINJAMAN */}
        <div className='space-y-2.5'>
          <label className='text-xs font-bold text-neutral-900 tracking-tight block'>
            Borrow Duration
          </label>
          <div className='space-y-2 text-xs font-bold text-neutral-600'>
            {durationOptions.map((days: number) => (
              <label
                key={days}
                className='flex items-center gap-3 cursor-pointer select-none'
              >
                <input
                  type='radio'
                  name='duration'
                  value={days}
                  checked={borrowDuration === days}
                  onChange={() => onDurationChange(days)}
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
                />
                <span>{days} Days</span>
              </label>
            ))}
          </div>
        </div>

        {/* RETURN DATE ALERT BANNER */}
        <div className='p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs space-y-1'>
          <span className='font-bold text-neutral-900 block'>Return Date</span>
          <p className='font-medium text-neutral-500'>
            Please return the book no later than{' '}
            <span className='text-rose-600 font-extrabold'>
              {formatDateDisplay(returnDate)}
            </span>
          </p>
        </div>

        {/* SYARAT & KETENTUAN CHECKBOXES */}
        <div className='space-y-3 text-xs font-bold text-neutral-600 pt-1'>
          <label className='flex items-start gap-3 cursor-pointer select-none leading-tight'>
            <input
              type='checkbox'
              checked={agreeTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAgreeTermsChange(e.target.checked)
              }
              className='mt-0.5 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer shrink-0'
            />
            <span>I agree to return the book(s) before the due date.</span>
          </label>
          <label className='flex items-start gap-3 cursor-pointer select-none leading-tight'>
            <input
              type='checkbox'
              checked={agreePolicy}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAgreePolicyChange(e.target.checked)
              }
              className='mt-0.5 h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer shrink-0'
            />
            <span>I accept the library borrowing policy.</span>
          </label>
        </div>

        {/* BUTTON SUBMIT CONFIRM */}
        <div className='pt-2'>
          <button
            type='submit'
            disabled={!agreeTerms || !agreePolicy || isPending}
            className='w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm tracking-wide transition shadow-md shadow-blue-500/10 flex items-center justify-center disabled:bg-neutral-300 disabled:cursor-not-allowed disabled:shadow-none focus:outline-none select-none cursor-pointer'
          >
            {isPending ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              'Confirm & Borrow'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
