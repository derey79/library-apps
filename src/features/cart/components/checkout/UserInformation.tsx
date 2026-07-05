interface UserInformationProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
  } | null;
}

export default function UserInformation({ user }: UserInformationProps) {
  return (
    <div className='space-y-4'>
      <h2 className='text-lg font-extrabold text-neutral-950 tracking-tight'>
        User Information
      </h2>
      <div className='space-y-3 max-w-md text-sm font-semibold text-neutral-600'>
        <div className='flex justify-between border-b border-neutral-100 pb-2'>
          <span className='text-neutral-400'>Name</span>
          <span className='text-neutral-950'>
            {user?.name || 'Anonymous Node'}
          </span>
        </div>
        <div className='flex justify-between border-b border-neutral-100 pb-2'>
          <span className='text-neutral-400'>Email</span>
          <span className='text-neutral-950'>{user?.email || '-'}</span>
        </div>
        <div className='flex justify-between pb-1'>
          <span className='text-neutral-400'>Nomor Handphone</span>
          <span className='text-neutral-950 font-mono'>
            {user?.phone || '-'}
          </span>
        </div>
      </div>
    </div>
  );
}
