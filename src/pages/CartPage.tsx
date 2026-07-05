import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/store/store';
import { CartItem, clearCart } from '@/store/slices/cartSlice';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import CartItemRow from '@/features/cart/components/CartItemRow';
import LoanSummaryCard from '@/features/cart/components/LoanSummaryCard';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [selectedIds, setSelectedIds] = useState<number[]>(
    cartItems.map((item: CartItem) => item.id)
  );

  const handleToggleItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    cartItems.length > 0 && selectedIds.length === cartItems.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((item: CartItem) => item.id));
    }
  };

  const handleClearCartClick = () => {
    if (
      window.confirm(
        'Are you sure you want to completely empty your cart workspace?'
      )
    ) {
      dispatch(clearCart());
      setSelectedIds([]);
      toast.success('All staged items purged from your cart node.');
    }
  };

  const handleProceedToCheckout = () => {
    const selectedCartItems = cartItems.filter((item: CartItem) =>
      selectedIds.includes(item.id)
    );

    if (selectedCartItems.length === 0) {
      toast.error('Please select at least one literature asset to borrow.');
      return;
    }

    navigate('/checkout', {
      state: { checkoutItems: selectedCartItems },
    });
  };

  return (
    <div className='w-full max-w-6xl mx-auto space-y-6 text-neutral-800 animate-fade-in pb-16 px-4 md:px-6'>
      <div className='text-left border-b border-neutral-100 pb-4 flex flex-col gap-1'>
        <Link
          to='/books'
          className='inline-flex items-center gap-2 text-xs font-bold text-neutral-400 hover:text-neutral-900 transition mb-1 select-none'
        >
          <ArrowLeft className='h-3.5 w-3.5' /> Back to Matrix Catalog
        </Link>
        <h1 className='text-2xl font-extrabold text-neutral-950 tracking-tight'>
          My Cart
        </h1>
      </div>

      {cartItems.length === 0 ? (
        <div className='p-16 text-center border border-dashed border-neutral-200 bg-neutral-50/40 rounded-[24px] flex flex-col items-center justify-center space-y-4'>
          <div className='h-12 w-12 rounded-full bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-neutral-400'>
            <ShoppingBag className='h-5 w-5' />
          </div>
          <p className='text-sm text-neutral-900 font-bold'>
            Your Cart is Vacant
          </p>
          <Link to='/books'>
            <button className='h-10 px-5 rounded-full bg-blue-600 hover:bg-blue-700 font-bold text-xs text-white shadow-sm transition'>
              Explore Collection
            </button>
          </Link>
        </div>
      ) : (
        <div className='flex flex-col md:flex-row gap-8 items-start'>
          <div className='flex-1 w-full bg-white border border-neutral-100 rounded-[24px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.01)] space-y-4'>
            <div className='flex items-center justify-between pb-3 border-b border-neutral-100 text-sm font-bold text-neutral-800 select-none'>
              {/* Sisi Kiri: Select All */}
              <label className='flex items-center gap-2.5 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={isAllSelected}
                  onChange={handleToggleSelectAll}
                  className='h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer'
                />
                <span>Select All</span>
              </label>

              {/* Sisi Kanan: Clear Cart Link Button */}
              <button
                type='button'
                onClick={handleClearCartClick}
                className='inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-rose-600 transition focus:outline-none cursor-pointer select-none'
              >
                <Trash2 className='h-3.5 w-3.5' />
                <span>Clear Cart</span>
              </button>
            </div>

            <div className='divide-y divide-neutral-100'>
              {cartItems.map((item: CartItem) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isChecked={selectedIds.includes(item.id)}
                  onToggle={handleToggleItem}
                />
              ))}
            </div>
          </div>

          <LoanSummaryCard
            selectedCount={selectedIds.length}
            isPending={false}
            onBorrow={handleProceedToCheckout}
          />
        </div>
      )}
    </div>
  );
}
