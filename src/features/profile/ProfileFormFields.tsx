import { User, Phone, Mail, Shield, Save, Loader2 } from 'lucide-react';

interface ProfileFormFieldsProps {
  name: string;
  phone: string;
  email: string;
  role: string;
  isPending: boolean;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileFormFields({
  name,
  phone,
  email,
  role,
  isPending,
  onNameChange,
  onPhoneChange,
  onSubmit,
}: ProfileFormFieldsProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
      {/* Deskripsi Samping */}
      <div className='space-y-1'>
        <h2 className='text-lg font-bold text-neutral-950 tracking-tight'>
          Account Parameters
        </h2>
        <p className='text-xs text-neutral-400 font-medium leading-relaxed max-w-xs'>
          Review your systemic library credentials. Email and systemic security
          authorization authorities are locked by root parameters.
        </p>
      </div>

      {/* Input Form Fields */}
      <form
        onSubmit={onSubmit}
        className='md:col-span-2 space-y-4 max-w-xl w-full'
      >
        {/* Field 1: Full Name */}
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'>
            <User className='h-3.5 w-3.5' /> Full Name
          </label>
          <input
            type='text'
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 bg-white focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all'
          />
        </div>

        {/* Field 2: Phone Number */}
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'>
            <Phone className='h-3.5 w-3.5' /> Phone Number
          </label>
          <input
            type='text'
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 bg-white focus:outline-none focus:border-neutral-300 focus:ring-4 focus:ring-neutral-500/5 transition-all'
          />
        </div>

        {/* Field 3: Email (READONLY) */}
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'>
            <Mail className='h-3.5 w-3.5' /> Email Address
          </label>
          <input
            type='text'
            disabled
            value={email}
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl bg-neutral-50 text-sm font-semibold text-neutral-400 cursor-not-allowed select-none focus:outline-none'
          />
        </div>

        {/* Field 4: Authority Role (READONLY) */}
        <div className='space-y-1.5'>
          <label className='text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5'>
            <Shield className='h-3.5 w-3.5' /> Role Authority
          </label>
          <input
            type='text'
            disabled
            value={role}
            className='w-full h-11 px-4 border border-neutral-200 rounded-xl bg-neutral-50 text-sm font-bold text-neutral-400 uppercase cursor-not-allowed select-none focus:outline-none tracking-wider'
          />
        </div>

        {/* Tombol Simpan */}
        <div className='pt-2 flex justify-end'>
          <button
            type='submit'
            disabled={isPending}
            className='h-11 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide transition shadow-md disabled:bg-neutral-400 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 focus:outline-none'
          >
            {isPending ? (
              <Loader2 className='h-3.5 w-3.5 animate-spin' />
            ) : (
              <Save className='h-3.5 w-3.5' />
            )}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
