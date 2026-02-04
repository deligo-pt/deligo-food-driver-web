import { redirect } from 'next/navigation';

const HomePage = async () => {
  return redirect('/rider-registration');
};

export default HomePage;