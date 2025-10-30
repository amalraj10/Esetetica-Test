import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import logo from "@/assets/logo.svg";

interface HeaderProps {
  userName?: string;
}

const Header = ({ userName = "Rajesh" }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <img src={logo} alt="Estetica" className="h-8 w-auto" />
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative">
            <Bell className="h-5 w-5 text-foreground" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-sm font-medium text-accent">AD</span>
            </div>
            <span className="hidden lg:inline text-sm font-medium">Profile</span>
          </div>
        </div>
      </div>

      <div className="mt-4 hidden lg:block">
        <div>
          <h2 className="text-lg font-semibold">Welcome Back, {userName}</h2>
          <p className="text-sm text-muted-foreground">
            Hello, here you can manage your orders by zone
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
