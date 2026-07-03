interface Tab {
  id: string;
  label: string;
}

interface LoansTabsProps {
  activeStatus: string;
  onTabChange: (status: string) => void;
}

export default function LoansTabs({
  activeStatus,
  onTabChange,
}: LoansTabsProps) {
  const statusTabs: Tab[] = [
    { id: 'all', label: 'All History' },
    { id: 'borrowed', label: 'Borrowed' },
    { id: 'returned', label: 'Returned' },
    { id: 'overdue', label: 'Overdue' },
  ];

  return (
    <div className='flex flex-wrap items-center gap-2 border-b border-neutral-100 pb-3'>
      {statusTabs.map((tab) => {
        const isSelected = activeStatus === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition select-none cursor-pointer focus:outline-none border ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
