import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { socket } from "../socket";
import { apiSlice } from "../store/slices/apiSlice";
import { notificationApiSlice } from "../store/slices/notificationApiSlice";

const useSocketEvents = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    const onNewNotification = (notification) => {
      // Always refresh notification list & badge
      dispatch(notificationApiSlice.util.invalidateTags(["Notification"]));

      // Optional toast (use severity/type if available)
      if (notification?.message) {
        toast.info(notification.message);
      }

      // Admin-only entity refresh
      if (user.role === "admin") {
        switch (notification.entityType) {
          case "user":
            dispatch(apiSlice.util.invalidateTags(["User"]));
            break;
          case "kyc":
            dispatch(apiSlice.util.invalidateTags(["KYC"]));
            break;
          case "product":
            dispatch(apiSlice.util.invalidateTags(["Product"]));
            break;
          case "order":
            dispatch(apiSlice.util.invalidateTags(["Order"]));
            break;
          default:
            break;
        }
      }
    };

    const onNewSeller = (seller) => {
      if (user.role === "admin") {
        toast.info(`🆕 New seller registered: ${seller.name}`);
        dispatch(apiSlice.util.invalidateTags(["User", "KYC"]));
      }
    };

    const onNewProduct = (product) => {
      if (user.role === "admin") {
        toast.success(`🛒 New product added: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(["Product"]));
      }
    };

    const onApproved = (product) => {
      if (user.role === "supplier") {
        toast.success(`✅ Product approved: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(["Product"]));
      }
    };

    const onRejected = (product) => {
      if (user.role === "supplier") {
        toast.error(`❌ Product rejected: ${product.name}`);
        dispatch(apiSlice.util.invalidateTags(["Product"]));
      }
    };

    socket.on("NEW_NOTIFICATION", onNewNotification);
    socket.on("NEW_SELLER_REGISTERED", onNewSeller);
    socket.on("NEW_PRODUCT_ADDED", onNewProduct);
    socket.on("PRODUCT_APPROVED", onApproved);
    socket.on("PRODUCT_REJECTED", onRejected);

    return () => {
      socket.off("NEW_NOTIFICATION", onNewNotification);
      socket.off("NEW_SELLER_REGISTERED", onNewSeller);
      socket.off("NEW_PRODUCT_ADDED", onNewProduct);
      socket.off("PRODUCT_APPROVED", onApproved);
      socket.off("PRODUCT_REJECTED", onRejected);
    };
  }, [user, dispatch]);
};

export default useSocketEvents;
