import UserControls from '../../components/UserControl';
import UserTable from '../../components/UserTable';

export default function Home() {
  return (
    <>
        <div className='p-4 text-center'>
            <UserControls />
            <UserTable />
        </div>
    </>
  );
}
