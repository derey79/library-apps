import { User, Phone, Mail, Shield, Save, Loader2 } from 'lucide-react';
import { ProfileFormFieldsProps } from '@/types/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LABEL_STYLE =
  'text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5';
const INPUT_EDITABLE_STYLE =
  'w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 bg-white focus:ring-4 focus:ring-neutral-500/5 transition-all';
const INPUT_READONLY_STYLE =
  'w-full h-11 px-4 border border-neutral-200 rounded-xl bg-neutral-50 text-sm font-semibold text-neutral-400 cursor-not-allowed select-none';

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
      <form
        onSubmit={onSubmit}
        className='md:col-span-2 space-y-4 max-w-xl w-full'
      >
        {/* Full Name */}
        <div className='space-y-1.5'>
          <Label className={LABEL_STYLE}>
            <User className='h-3.5 w-3.5' /> Full Name
          </Label>
          <Input
            type='text'
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={INPUT_EDITABLE_STYLE}
          />
        </div>

        {/* Phone Number */}
        <div className='space-y-1.5'>
          <Label className={LABEL_STYLE}>
            <Phone className='h-3.5 w-3.5' /> Phone Number
          </Label>
          <Input
            type='text'
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className={INPUT_EDITABLE_STYLE}
          />
        </div>

        {/* Email (readonly) */}
        <div className='space-y-1.5'>
          <Label className={LABEL_STYLE}>
            <Mail className='h-3.5 w-3.5' /> Email Address
          </Label>
          <Input
            type='text'
            disabled
            value={email}
            className={INPUT_READONLY_STYLE}
          />
        </div>

        <div className='space-y-1.5'>
          <Label className={LABEL_STYLE}>
            <Shield className='h-3.5 w-3.5' /> Role Authority
          </Label>
          <Input
            type='text'
            disabled
            value={role}
            className={`${INPUT_READONLY_STYLE} font-bold uppercase tracking-wider`}
          />
        </div>

        {/* Tombol Simpan */}
        <div className='pt-2 flex justify-end'>
          {/* ✅ PERBAIKAN: Menggunakan komponen UI <Button> bawaan shadcn */}
          <Button
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
          </Button>
        </div>
      </form>
    </div>
  );
}
