import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { socket } from '../socket';
import { apiSlice } from '../store/slices/apiSlice';

const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const onNewSeller = (seller) => {
      if (user.role === 'admin') {
        toast.info(`🆕 New seller registered: ${seller.name}`);
        dispatch(apiSlice.util.invalidateTags(['User', 'KYC']));
      }
    };

    const onNewProduct = (product) => {
      if (user.role === 'admin') {
        toast.success(`🛒 New product added: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(['Product']));
      }
    };

    const onApproved = (product) => {
      if (user.role === 'supplier') {
        toast.success(`✅ Product approved: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(['Product']));
      }
    };

    const onRejected = (product) => {
      if (user.role === 'supplier') {
        toast.error(`❌ Product rejected: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(['Product']));
      }
    };

    socket.on('NEW_SELLER_REGISTERED', onNewSeller);
    socket.on('NEW_PRODUCT_ADDED', onNewProduct);
    socket.on('PRODUCT_APPROVED', onApproved);
    socket.on('PRODUCT_REJECTED', onRejected);

    return () => {
      socket.off('NEW_SELLER_REGISTERED', onNewSeller);
      socket.off('NEW_PRODUCT_ADDED', onNewProduct);
      socket.off('PRODUCT_APPROVED', onApproved);
      socket.off('PRODUCT_REJECTED', onRejected);
    };
  }, [user, dispatch]);
};

export default useSocketEvents;
