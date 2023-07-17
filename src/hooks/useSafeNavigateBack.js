import { useNavigate } from 'react-router-dom';

const useSafeNavigateBack = () => {
  const navigate = useNavigate();
  return () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };
};

export {
  useSafeNavigateBack,
}
