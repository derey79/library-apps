import {
  BookOpen,
  AlertCircle,
  CheckCircle,
  User,
  BarChart3,
} from 'lucide-react';

interface LoanStats {
  borrowed: number;
  late: number;
  returned: number;
  total: number;
}

interface ProfileStatsCardsProps {
  stats?: LoanStats;
}

export default function ProfileStatsCards({ stats }: ProfileStatsCardsProps) {
  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-2 text-neutral-800'>
        <BarChart3 className='h-4 w-4 text-neutral-500' />
        <h3 className='text-sm font-bold uppercase tracking-wider text-neutral-500'>
          Workspace Statistics
        </h3>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {/* Kartu Buku Aktif Dipinjam */}
        <div className='p-4 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-3.5'>
          <div className='h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0'>
            <BookOpen className='h-5 w-5' />
          </div>
          <div>
            <span className='text-2xl font-extrabold text-neutral-900 block leading-tight'>
              {stats?.borrowed || 0}
            </span>
            <span className='text-[11px] font-bold text-neutral-400 uppercase tracking-wide'>
              Borrowed
            </span>
          </div>
        </div>

        {/* Kartu Terlambat (Overdue) */}
        <div className='p-4 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-3.5'>
          <div
            className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
              stats?.late && stats.late > 0
                ? 'bg-rose-500/10 text-rose-600 animate-pulse'
                : 'bg-neutral-100 text-neutral-400'
            }`}
          >
            <AlertCircle className='h-5 w-5' />
          </div>
          <div>
            <span className='text-2xl font-extrabold text-neutral-900 block leading-tight'>
              {stats?.late || 0}
            </span>
            <span className='text-[11px] font-bold text-neutral-400 uppercase tracking-wide'>
              Overdue
            </span>
          </div>
        </div>

        {/* Kartu Berhasil Dikembalikan */}
        <div className='p-4 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-3.5'>
          <div className='h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0'>
            <CheckCircle className='h-5 w-5' />
          </div>
          <div>
            <span className='text-2xl font-extrabold text-neutral-900 block leading-tight'>
              {stats?.returned || 0}
            </span>
            <span className='text-[11px] font-bold text-neutral-400 uppercase tracking-wide'>
              Returned
            </span>
          </div>
        </div>

        {/* Kartu Total Semua Transaksi */}
        <div className='p-4 bg-white border border-neutral-100 rounded-[20px] shadow-sm flex items-center gap-3.5'>
          <div className='h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 shrink-0'>
            <User className='h-5 w-5' />
          </div>
          <div>
            <span className='text-2xl font-extrabold text-neutral-900 block leading-tight'>
              {stats?.total || 0}
            </span>
            <span className='text-[11px] font-bold text-neutral-400 uppercase tracking-wide'>
              Total Loans
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
