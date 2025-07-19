
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css'
import User from './components/listUser';
import EditRole from './pages/editRole';
import AddRoles from './pages/addRoles';
import { useParams } from 'react-router-dom';

const EditRoleWrapper = () => {
  const { id } = useParams();
  return <EditRole userId={Number(id)} />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User />} />
        <Route path="/users" element={<User />} />
        <Route path="/add-roles-user/:id" element={<EditRoleWrapper />} />
        <Route path="/add-roles" element={<AddRoles />} />
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
