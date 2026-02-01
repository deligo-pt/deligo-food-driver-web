import { redirect } from 'next/navigation';

const HomePage = async () => {
  return redirect('/driver-register');
};

export default HomePage;