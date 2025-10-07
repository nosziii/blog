import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const isAuthenticated = ref(false);
  const showLoginModal = ref(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/check-auth');
      const data = await res.json();
      isAuthenticated.value = data.authenticated;
      if (!isAuthenticated.value) {
        showLoginModal.value = true;
      }
      return data.authenticated;
    } catch (error) {
      console.error('Auth check failed:', error);
      isAuthenticated.value = false;
      showLoginModal.value = true;
      return false;
    }
  };

  const handleLogin = async (credentials: any) => {
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await res.json();
      if (data.success) {
        isAuthenticated.value = true;
        showLoginModal.value = false;
        return true; // Success
      } else {
        alert('Invalid credentials');
        return false; // Failure
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login request failed.');
      return false;
    }
  };

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    isAuthenticated.value = false;
    router.push('/');
  };

  return {
    isAuthenticated,
    showLoginModal,
    checkAuth,
    handleLogin,
    handleLogout,
  };
}
