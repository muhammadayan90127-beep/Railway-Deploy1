import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";

import { AuthProvider } from "@/contexts/AuthContext";
import { CustomCursor } from "./components/CustomCursor";
import { AdminPanel } from "./pages/AdminPanel";
import { MainPage } from "./pages/MainPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { SettingsPage } from "./pages/SettingsPage";
import { VerifyPage } from "./pages/VerifyPage";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

setAuthTokenGetter(() => {
  return localStorage.getItem("mh_user_token") || localStorage.getItem("mh_admin_token");
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="bg-background text-foreground min-h-screen selection:bg-primary/30 selection:text-primary">
            <CustomCursor />
            <Switch>
              <Route path="/admin" component={AdminPanel} />
              <Route path="/login" component={LoginPage} />
              <Route path="/register" component={RegisterPage} />
              <Route path="/dashboard" component={DashboardPage} />
              <Route path="/settings" component={SettingsPage} />
              <Route path="/verify/:consultationId" component={VerifyPage} />
              <Route path="/" component={MainPage} />
              <Route component={NotFound} />
            </Switch>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
