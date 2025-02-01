import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Settings as SettingsIcon } from "lucide-react";
import { useToast } from "./ui/use-toast";

const Settings = () => {
  const [ipAddress, setIpAddress] = useState("127.0.0.1");
  const [port, setPort] = useState("8080");
  const { toast } = useToast();

  const handleSave = () => {
    // In the future, this will handle UDP connection
    toast({
      title: "Settings saved",
      description: `IP: ${ipAddress}, Port: ${port}`,
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-primary/10 hover:bg-primary/20 border-primary/20"
        >
          <SettingsIcon className="h-6 w-6 text-primary" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Connection Settings</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="ip-address" className="text-sm font-medium">
              IP Address
            </label>
            <Input
              id="ip-address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="Enter IP address"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="port" className="text-sm font-medium">
              Port
            </label>
            <Input
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="Enter port number"
            />
          </div>
          <Button onClick={handleSave} className="mt-4">
            Save Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;