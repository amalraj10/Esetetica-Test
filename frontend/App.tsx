
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import OrderCompletion from "./pages/OrderCompletion";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/order-completion" element={<OrderCompletion />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

  </QueryClientProvider>
);

export default App;
