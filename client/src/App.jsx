import RouterRoutes from "./router.route";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <RouterRoutes />
    </AuthProvider>
  );
}

export default App;
