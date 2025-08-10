import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { muiTheme } from "@/theme/muiTheme";
import { HelmetProvider } from "react-helmet-async";
import AppHeader from "@/components/layout/AppHeader";
import CreateForm from "@/pages/CreateForm";
import Preview from "@/pages/Preview";
import MyForms from "@/pages/MyForms";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <HelmetProvider>
        <ThemeProvider theme={muiTheme}>
          <TooltipProvider>
            <CssBaseline />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppHeader />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/create" element={<CreateForm />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/myforms" element={<MyForms />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </HelmetProvider>
    </Provider>
  </QueryClientProvider>
);

export default App;
